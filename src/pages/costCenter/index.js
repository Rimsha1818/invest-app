import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  notification,
  Space,
  Tag,
  Pagination,
} from "antd";
import {
  AppstoreAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import costCenterService from "../../services/costCenter";
import LocationComponent from "../../components/location";
import DepartmentComponent from "./../../components/department/index";

const CostCenter = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getSections = async (
    page = 1,
    itemsPerPageFromState = itemsPerPage
  ) => {
    setLoading(true);
    try {
      const response = await costCenterService.getCostCenter(
        page,
        itemsPerPageFromState
      );
      if (response) {
        setData(response.data); // Update data with response.data
        console.log("response.meta ", response);
        setCurrentPage(response.current_page);
        setTotalDataCount(response.total);
        setItemsPerPage(response.per_page);
        console.log("per_page ", response.per_page);
      } else {
        // Handle the case where response is not successful
        console.error("API request failed:", response);
        notification.error({
          message: "Error",
          description: response?.message || "Failed to fetch cost center data.", // Display error message from API if available
        });
      }
    } catch (error) {
      console.error("Error fetching cost center data:", error);
      notification.error({
        message: "Error",
        description: error?.response.data?.message || "Something went wrong", // Access error message safely
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSections();
  }, []);
  const onChange = (currentPage) => {
    console.log("Page: ", currentPage);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the record: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await costCenterService.deleteCostCenter(record.id);
          if (response.success) {
            notification.success({
              message: "Cost Center Deleted",
              description: response.message,
            });
            getSections(currentPage);
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.response.data.message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditing(record);
    setIsModalVisible(true);

    form.setFieldsValue({
      cost_center: record.cost_center,
      department_id: record.department.id,
      location_id: record.location.id,
      description: record.description,
      project: record.project,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        const response = await costCenterService.updateCostCenter(
          editing.id,
          values
        );
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Cost Center Updated",
            description: response.message,
          });
          getSections(currentPage);
        }
      } else {
        const response = await costCenterService.postCostCenter(values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Cost Center Added",
            description: response.message,
          });
          getSections(currentPage);
        }
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Cost Center",
      dataIndex: "cost_center",
      key: "cost_center",
      // sorter: (a, b) => a.cost_center.localeCompare(b.cost_center),
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      // sorter: (a, b) => a.department.name.localeCompare(b.department.name),
      render: (text, record) => <Tag>{text}</Tag>,
    },
    {
      title: "Location",
      dataIndex: ["location", "name"],
      key: "location",
      // sorter: (a, b) => a.location.name.localeCompare(b.location.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      // sorter: (a, b) =>
      //   (a.description || '').localeCompare(b.description || ''),
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      // sorter: (a, b) =>
      //   (a.project || '').localeCompare(b.project || ''),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <Space>
          <div onClick={() => handleEdit(record)} style={{ cursor: "pointer" }}>
            <EditOutlined />
          </div>
          <div
            onClick={() => handleDelete(record)}
            style={{ cursor: "pointer" }}
          >
            <DeleteOutlined />
          </div>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<AppstoreAddOutlined />}
            title="Cost Center"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Cost Center
              </Button>
            }
          />
        </Col>
      </Row>

      <Card>
        <Table
          scroll={{ x: 1000 }}
          style={{ minHeight: "100vh" }}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            defaultCurrent: currentPage,
            showPrevNextJumpers: true,
            showSizeChanger: false,
            onChange: (page) => {
              setCurrentPage(page); // Update currentPage first
              getSections(page, itemsPerPage); // Then fetch data
            },
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? "Edit Cost Center" : "Add Cost Center"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={650}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="mt-20"
        >
          <Form.Item
            name="cost_center"
            label="Cost Center Name"
            rules={[
              { required: true, message: "Please enter the Cost Center Name" },
            ]}
          >
            <Input size="large" placeholder="Type Cost Center Name" />
          </Form.Item>
          <Form.Item
            name="project"
            label="Project"
            rules={[
              { required: true, message: "Please enter the Project Name" },
            ]}
          >
            <Input size="large" placeholder="Type Project Name" />
          </Form.Item>
          <Form.Item
            name="department_id"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >

          <DepartmentComponent all={true} />
          </Form.Item>

          <Form.Item
            name="location_id"
            label="Location"
            rules={[{ required: true, message: "Please select Location" }]}
          >
            <LocationComponent all={true} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {" "}
              {editing ? "Save Changes" : "Add Cost Center"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CostCenter;

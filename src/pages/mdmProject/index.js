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
  Select,
} from "antd";
import {
  AppstoreAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import mdmProjectService from "../../services/mdmProject";
import MdmCatComponent from "../../components/mdmCat";
import categoryService from "../../services/category";


const MdmProject = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);

  const getCategories = async () => {
    let response;
    response = await categoryService.getAllCategories();
    setCategories(response);
  };


  useEffect(() => {
    getCategories();
  }, []);

  const getProjects = async (
    page = 1,
    itemsPerPageFromState = itemsPerPage
  ) => {
    setLoading(true);
    try {
      const response = await mdmProjectService.getMdmProject(
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
          description: response?.message || "Failed to fetch Project data.", // Display error message from API if available
        });
      }
    } catch (error) {
      console.error("Error fetching Project data:", error);
      notification.error({
        message: "Error",
        description: error?.response.data?.message || "Something went wrong", // Access error message safely
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProjects();
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
          const response = await mdmProjectService.deleteMdmProject(record.id);
          if (response.success) {
            notification.success({
              message: "Project Deleted",
              description: response.message,
            });
            getProjects(currentPage);
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
      name: record.name,
      software_category_id: record.software_category.id,
      mdm_category_id: record.mdm_category.id,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        const response = await mdmProjectService.updateMdmProject(
          editing.id,
          values
        );
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Project Updated",
            description: response.message,
          });
          getProjects(currentPage);
        }
      } else {
        const response = await mdmProjectService.postMdmProject(values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Project Added",
            description: response.message,
          });
          getProjects(currentPage);
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
      title: "Project",
      dataIndex: "name",
      key: "project",
      // sorter: (a, b) =>
      //   (a.project || '').localeCompare(b.project || ''),
    },
    {
      title: "Category",
      dataIndex: ["software_category", "name"],
      key: "software_category",
      // sorter: (a, b) => a.department.name.localeCompare(b.department.name),
      render: (text, record) => <Tag>{text}</Tag>,
    },
    {
      title: "MDM Category",
      dataIndex: ["mdm_category", "name"],
      key: "mdm_category",
      // sorter: (a, b) => a.location.name.localeCompare(b.location.name),
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   // sorter: (a, b) =>
    //   //   (a.description || '').localeCompare(b.description || ''),
    // },
   
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
            title="Project"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Project
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
              getProjects(page, itemsPerPage); // Then fetch data
            },
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? "Edit Project" : "Add Project"}
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
            name="name"
            label="Project"
            rules={[
              { required: true, message: "Please enter the Project Name" },
            ]}
          >
            <Input size="large" placeholder="Type Project Name" />
          </Form.Item>

          <Form.Item name="software_category_id" label="Category">
            <Select
              showSearch={true}
              optionFilterProp="children"
              style={{ width: "100%" }}
              size="large"
              placeholder="Please Select Category"
              // onChange={onCategoryChange}
              allowClear
            >
              {categories &&
                categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="mdm_category_id"
            label="MDM Category"
            rules={[{ required: true, message: "Please select a Mdm Category" }]}
          >

          <MdmCatComponent all={true} />
          </Form.Item>


{/*          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>*/}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {" "}
              {editing ? "Save Changes" : "Add Project"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default MdmProject;

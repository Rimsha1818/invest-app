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
} from "antd";
import {
  AppstoreAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import sectionService from "../../services/section";

import DepartmentComponent from "../../components/department";

const Sections = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getSections = async (page = 1) => {
    setLoading(true);

    await sectionService.getSections().then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  useEffect(() => {
    getSections();
  }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the section: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await sectionService.deleteSection(record.id);
          if (response.success) {
            notification.success({
              message: "Section Deleted",
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
      name: record.name,
      department_id: record.department.id,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      if (editing) {
        const response = await sectionService.updateSection(editing.id, values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Section Updated",
            description: response.message,
          });
          getSections(currentPage);
        }
      } else {
        const response = await sectionService.postSection(values);

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Section Added",
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
      title: "Section Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      //...getColumnSearchProps('name'),
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      sorter: (a, b) => a.name.localeCompare(b.name),
      //...getColumnSearchProps('department'),
      render: (text, record) => {
        return <Tag>{text}</Tag>;
      },
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
            title="Sections"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Section
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
            onChange: (page, pageSize) => getSections(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? "Edit Section" : "Add Section"}
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
            label="Section"
            rules={[{ required: true, message: "Please enter the section" }]}
          >
            <Input size="large" placeholder="Type Section Name" />
          </Form.Item>

          <Form.Item
            name="department_id"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <DepartmentComponent all />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? "Save Changes" : "Add Section"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default Sections;

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
import projectService from "../../services/project";

import DepartmentComponent from "../../components/department";
import FormListComponent from "./../../components/serviceDeskFormList";


const Projects = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [formId, setFormId] = useState([]);

  const getProjects = async (page = 1) => {
    setLoading(true);

    await projectService.getProjects().then((response) => {
      console.log('response', response)
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the project: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await projectService.deleteProject(record.id);
          if (response.success) {
            notification.success({
              message: "Section Deleted",
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
    setFormId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditing(null);
    setFormId(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditing(record);
    setIsModalVisible(true);
    setFormId(record.form.id)
    form.setFieldsValue({
      name: record.name,
      form_id: record.form.id,
    });
  };


  const handleFormChange = (selectedValue) => {
    setFormId(selectedValue);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      if (editing) {
        const response = await projectService.updateProject(editing.id, values);
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
        const response = await projectService.postProject(values);

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
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      //...getColumnSearchProps('name'),
    },
    {
      title: "Form",
      dataIndex: ["form", "name"],
      key: "form",
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
            title="Projects"
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
            onChange: (page, pageSize) => getProjects(page),
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
            rules={[{ required: true, message: "Please enter the Project" }]}
          >
            <Input size="large" placeholder="Type Project Name" />
          </Form.Item>
          <Form.Item
            name="form_id"
            label="Form"
            rules={[{ required: true, message: "Please select form" }]}
          >
            <FormListComponent
              onChange={handleFormChange}
              selectedFormId={formId}
              />
          </Form.Item>

{/*          <Form.Item
            name="department_id"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <DepartmentComponent all />
          </Form.Item>*/}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? "Save Changes" : "Add Project"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default Projects;

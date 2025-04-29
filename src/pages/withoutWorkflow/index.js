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
  Select,
} from "antd";
import {
  AppstoreAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import withoutWorkflowService from "../../services/withoutWorkflow";

import FormListComponent from "./../../components/serviceDeskFormList";
import categoryService from "../../services/category";


const WithoutWorkflow = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formId, setFormId] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState([]);

  const getWithoutWfs = async (page = 1) => {
    setLoading(true);

    await withoutWorkflowService.getWithoutWfs().then((response) => {
      console.log('response', response)
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };
  const getCategories = async () => {
    let response;
    response = await categoryService.getAllCategories();
    setCategories(response);
  };


  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getWithoutWfs();

  }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the Category from form: ${record.software_category.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await withoutWorkflowService.deleteWithoutWfs(record.id);
          // if (response.success) {
            notification.success({
              message: "Deleted",
              description: 'Record Has been Deleted',
            });
            getWithoutWfs(currentPage);
          // }
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.response.data?.message,
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
    setFormId(record.form.id)
    setSelectedCatId(record.software_category.id)
    form.setFieldsValue({
      name: record.name,
      form_id: record.form.id,
      software_category_id: record.software_category.id,
    });
  };


  const handleFormChange = (selectedValue) => {
    setFormId(selectedValue);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      if (editing) {
        const response = await withoutWorkflowService.updateWithoutWfs(editing.id, values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Updated",
            description: response.message,
          });
          getWithoutWfs(currentPage);
        }
      } else {
        const response = await withoutWorkflowService.postWithoutWfs(values);

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Added",
            description: response.message,
          });
          getWithoutWfs(currentPage);
        }
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Software Categories",
      dataIndex: ["software_category", "name"],
      key: "software_category",
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
            title="Without Workflow "
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Categories
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
            onChange: (page, pageSize) => getWithoutWfs(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? "Edit " : "Add "}
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
            name="form_id"
            label="Form"
            rules={[{ required: true, message: "Please select form" }]}
          >
            <FormListComponent
              onChange={handleFormChange}
              selectedFormId={formId}
              />
          </Form.Item>

          <Form.Item name="software_category_id" label="Category">
            <Select
              showSearch={true}
              optionFilterProp="children"
              style={{ width: "100%" }}
              size="large"
              placeholder="Please Select Category"
              // onChange={onCategoryChange}
              defaultValue={selectedCatId}
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


          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? "Save Changes" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default WithoutWorkflow;

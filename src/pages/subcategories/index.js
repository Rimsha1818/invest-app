import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, Card, Space, notification, Tag } from 'antd';
import { AppstoreAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import subCategoryService from '../../services/subCategory';
import SimpleCategoryComponent from './../../components/simpleCategory/index';

const SubCategories = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

  const getSubCategories = async (page = 1) => {
    setLoading(true);
    await subCategoryService.getSubCategories(page).then((response) => {
      setData(response.data);
      setCurrentPage(page);
      setTotalDataCount(response.data.total);
      setItemsPerPage(response.data.per_page);
      setLoading(false);
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the subcategory: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await subCategoryService.deleteSubcategory(record.id);
          if (response.success) {
            notification.success({
              message: 'Subcategory Deleted',
              description: response.message,
            });
            getSubCategories(currentPage);
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: error.response.data.message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    getSubCategories();
  }, []);
  
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
    setCurrentSubCategoryId(record.id);
    form.setFieldsValue({
      name: record.name,
      software_category_id: record.software_category.id
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        const response = await subCategoryService.updateSubCategory(editing.id, values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: 'Subcategory Updated',
            description: response.message,
          });
          getSubCategories(currentPage);
        } 
      } else {
        const response = await subCategoryService.postSubCategory(values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: 'Subcategory Added',
            description: response.message,
          });
          getSubCategories(currentPage);
        } 
      }
    } catch (error) {
      notification.error({
            message: 'Error',
        description: error.response.data.message,
          });
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: 'Subcategory Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category Name',
      dataIndex: ['software_category', 'name'],
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => {
        return (
            <Tag>{text}</Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <Space>
        <div
     onClick={() => handleEdit(record)}
     style={{ cursor: 'pointer' }}
   >
     <EditOutlined /> 
   </div>
 
   <div
     onClick={() => handleDelete(record)}
     style={{ cursor: 'pointer' }}
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
            icon={<AppstoreAddOutlined/>}
            title="Subcategories"
            right={(
              <Button className='btn-blue' type="primary" onClick={showModal}>
                Add Subcategory             </Button>
            )}
          />
        </Col>
      </Row>

      <Card>
      <Table
        scroll={{ x: 1000 }}  
        style={{ minHeight: '100vh' }}
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))} 
        pagination={{
          total: totalDataCount,
          current: currentPage,
          pageSize: itemsPerPage, 
          onChange: (page, pageSize) => getSubCategories(page),
        }}
        loading={loading} 
      />
      </Card>

      <Modal
        title={editing ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={650}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className='mt-20'>
          <Form.Item
            name="name"
            label="Subcategory"
            rules={[
              { required: true, message: 'Please enter the Subcategory' },
            ]}
          >
            <Input size='large'
            placeholder="Type subcategory name" />
          </Form.Item>

          <Form.Item
            name="software_category_id"
            label="Category"
            rules={[
              { required: true, message: 'Please select a category' },
            ]}
          >
            <SimpleCategoryComponent />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? 'Save Changes' : 'Add Category'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default SubCategories;

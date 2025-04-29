import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Space,
  Card,
  notification,
  Select,
  Tag,
} from 'antd';
import { TeamOutlined, EditOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import subCategoryService from '../../services/subCategory';
import businessexpertService from '../../services/businessexpert';
import UserComponent from '../../components/user';
const { Option } = Select;

const BusinessExpert = () => {
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [data, setData] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const getSubCategories = async () => {
    try {
      const response = await subCategoryService.getSubCategories();
      setSubCategories(response);
    } catch (error) {}
  };

  const getBusinessexpert = async () => {
    try {
      setLoading(true);
      const response = await businessexpertService.getBusinessexpert();

      setLoading(false);
      setData(response);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubCategories();
    getBusinessexpert();
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
    form.setFieldsValue({
      business_expert_user_id: record.business_expert_user.id,
      software_subcategory_id: record.software_subcategory.id,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        const response = await businessexpertService.updateBusinessexpert(
          editing.id,
          values
        );
        if (response) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: 'Business Expert Updated',
            description: response.message,
          });
          getBusinessexpert(currentPage);
        }
      } else {
        const response = await businessexpertService.postBusinessexpert(values);

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();

          notification.success({
            message: 'Business Expert Added',
            description: response.message,
          });

          getBusinessexpert(currentPage);
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
      title: 'Business Expert',
      dataIndex: ['business_expert_user', 'name'],
      key: 'business_expert_user',
      sorter: (a, b) =>
        a.business_expert_user.name.localeCompare(b.business_expert_user.name),
    },
    {
      title: 'Subcategory',
      dataIndex: ['software_subcategory', 'name'],
      key: 'software_subcategory',
      sorter: (a, b) =>
        a.software_subcategory.name.localeCompare(b.software_subcategory.name),
      render: (text, record) => <Tag>{record.software_subcategory.name}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <Space>
          <div onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }}>
            <EditOutlined />
          </div>

          {/* <div
     onClick={() => handleDelete(record)}
     style={{ cursor: 'pointer' }}
   >
     <DeleteOutlined /> 
   </div> */}
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<TeamOutlined />}
            title="Business Experts"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Business Expert
              </Button>
            }
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
            onChange: (page, pageSize) => getBusinessexpert(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Business Expert' : 'Add Business Expert'}
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
            name="business_expert_user_id"
            label="Business Expert"
            rules={[
              { required: true, message: 'Please select a business expert' },
            ]}
          >
            <UserComponent />
          </Form.Item>
          <Form.Item
            name="software_subcategory_id"
            label="Select SubCategory"
            rules={[{ required: true, message: 'Please select a Subcategory' }]}
          >
            <Select
              showSearch={true}
              optionFilterProp="children"
              placeholder="Select Subcategory"
              size="large"
            >
              {subCategories.map((subCategory) => (
                <Option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? 'Save Changes' : 'Add Business Expert'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default BusinessExpert;

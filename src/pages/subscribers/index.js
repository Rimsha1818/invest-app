import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Space, Input, Row, Col, Select, Card, notification, Tag } from 'antd';
import {
  UsergroupAddOutlined, EditOutlined
} from '@ant-design/icons';
import subscriberService from '../../services/subscriber';
import userService from '../../services/user';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import UserComponent from './../../components/user/index';

const Subscribers = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEdit(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEdit(record);

    const selectedSubscribers = record.users.map((user) => user.id);
    form.setFieldsValue({
      ...record,
      users: selectedSubscribers,
    });

    setIsModalVisible(true);
  };

  const getSubscribers = async (page = 1) => {
    setLoading(true);
    await subscriberService.getSubscribers().then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
      setUserData(
        response.reduce((acc, subscriber) => {
          if (subscriber.id && subscriber.users) {
            acc[subscriber.id] = subscriber.users;
          }
          return acc;
        }, {})
      );
    });
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (edit) {
        const response = await subscriberService.updateSubscriber(edit.id, values);
        if (response.success === true) {
          setIsModalVisible(false);
          setEdit(null);
          form.resetFields();
          notification.success({
            message: 'Subscriber Updated',
            description: response.message,
          });
          getSubscribers(currentPage);
        }
      } else {
        const response = await subscriberService.postSubscriber(values);
        if (response.data) {
          setIsModalVisible(false);
          setEdit(null);
          form.resetFields();
          notification.success({
            message: 'Subscriber Added',
            description: response.message,
          });
          getSubscribers(currentPage);
        }
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Subscribers Group Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Subscribers List',
      key: 'subscribers',
      width: 500,
      sorter: (a, b) => {
        const subscribersA = (userData[a.id] || []).map(user => user.name).join(', ');
        const subscribersB = (userData[b.id] || []).map(user => user.name).join(', ');
        return subscribersA.localeCompare(subscribersB);
      },
      render: (text, record) => (
        <div>
          {userData[record.id] ? (
            userData[record.id].map((user, index) => (
              <Tag title={user.name} key={index}>{user.name}</Tag>
            ))
          ) : (
            "No user data available"
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 60,
      render: (text, record) => (
        <Space>
          <div
            onClick={() => handleEdit(record)}
            style={{ cursor: 'pointer' }}
          >
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

  const handleAvatarClick = (avatar) => {
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UsergroupAddOutlined />}
            title="Subscribers"
            right={(
              <Button className='btn-blue' type="primary" onClick={showModal}>
                Add Subscriber
              </Button>
            )}
          />
        </Col>
      </Row>

      <Card>
        <Table
          scroll={{ x: 1000 }}
          style={{ minHeight: '100vh' }}
          loading={loading}
          columns={columns}
          dataSource={data.map((item, index) => ({ ...item, key: index }))}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getSubscribers(page),
          }}
        />
      </Card>

      <Modal
        title={edit ? 'Edit Subscriber' : 'Add Subscriber'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={650}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className='mt-20'>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[
              { required: true, message: 'Please enter the group name' },
            ]}
          >
            <Input size='large' placeholder='Type Group Name' />
          </Form.Item>

          <Form.Item
            name="users"
            label="Subscribers"
            rules={[
              { required: true, message: 'Please select subscribers' },
            ]}
          >
            <UserComponent mode="multiple" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {edit ? 'Save Changes' : 'Add Group'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default Subscribers;

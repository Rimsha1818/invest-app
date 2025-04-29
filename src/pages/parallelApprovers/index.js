import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
} from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import parallelApproverService from '../../services/parallelApprover';
import UserComponent from './../../components/user/index';

const { confirm } = Modal;
const ParallelApprovers = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const { currentUser } = useSelector((state) => state.user);

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this record?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
        await parallelApproverService.deleteParallelUsers(id);
        notification.success({
          message: 'Parallel Approver Deleted',
          description: 'Delete Successfully',
        });
        getParallelUsers();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response,
      });
    }
    finally {
      setLoading(false);
    }
  };


  const getParallelUsers = async () => {
    try {
      setLoading(true);
      const response = await parallelApproverService.getParallelUsers();
      setData(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getParallelUsers();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setIsModalVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (!values.location_id) {
        values.location_id = null;
      }
      if(!currentUser.roles.includes('admin')) {
        values.user_id = currentUser.user_id;
      }
      if (editing) {
        const response = await parallelApproverService.updateParallelUsers(
          editingId,
          values
        );
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
  
          notification.success({
            message: 'Parallel Approver Updated',
            description: response.message,
          });
          getParallelUsers();
        }
      } else {
        const response = await parallelApproverService.postParallelUsers(values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: 'Parallel Approver Added',
            description: response.message,
          });
          getParallelUsers();
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
      title: 'Approver User',
      dataIndex: ['user', 'name'],
      key: 'name',
      sorter: (a, b) =>
        a.user.name.localeCompare(b.user.name),
    },
    {
      title: 'Parallel Approver User',
      dataIndex: ['parallel_users', 'name'],
      key: 'name',
      sorter: (a, b) =>
        a.parallel_user.name.localeCompare(b.parallel_user.name),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <Space>
          <div onClick={() => showDeleteConfirm(record.id)} style={{ cursor: 'pointer' }}>
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
            icon={<EditOutlined />}
            title="Parallel Approvers"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add New
              </Button>
            }
          />
        </Col>
      </Row>

      <Card style={{height: '100vh'}}>
        <Table
          scroll={{ x: 1000 }}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          pagination={false}
          loading={loading}
        />
        <Modal
          width={800}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={form.submit}
          okButtonProps={{ loading: loading }}
        >
          <Card
            title={editing ? 'Edit Parallel Approver' : 'Add Parallel Approver'}
          >
            <Form form={form} onFinish={onFinish} layout="vertical">
                  {currentUser.roles.includes('admin') && 
                    <Form.Item
                    name="user_id"
                    label="User"
                    rules={[{ required: true, message: 'Please select user' }]}
                  >
                    <UserComponent multiselect={false}/>
                  </Form.Item>
                  }
                  <Form.Item
                    name="parallel_user_id"
                    label="Parallel User"
                    rules={[{ required: true, message: 'Please select parallel user' }]}
                  >
                    <UserComponent multiselect={false}/>
                  </Form.Item>
            </Form>
          </Card>
        </Modal>
      </Card>
    </DefaultLayout>
  );
};

export default ParallelApprovers;

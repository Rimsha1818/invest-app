import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, Space, Select, Tooltip, Card, notification, Badge } from 'antd';
import { UsergroupAddOutlined, EditOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import approverService from '../../services/approver';
import { useMediaQuery } from 'react-responsive';
import userService from '../../services/user';

const { Option } = Select;

const Approvers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [users, setUsers] = useState(null);
  const [approversData, setApproversData] = useState([{ approver: undefined, permission: 1 }]);

  const getUsers = async () => {
    let response;
    response = await userService.getUsers();
    setUsers(response.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEdit(null);
    form.resetFields();
  };

  /*
  const handleEdit = (record) => {
    setEdit(record);
    setIsModalVisible(true);
  
    form.setFieldsValue({
      name: record.name,
      users: record.users.map(user => user.id), 
      approval_required: record.users.map(user => user.pivot.approval_required),
      sequence_no: record.users.map(user => user.pivot.sequence_no), 
    });
  };
  */

  const handleEdit = (record) => {
    setEdit(record);
    setIsModalVisible(true);
    const selectedApproversData = record.users.map((user) => ({
      users: user.id,
      approval_required: user.pivot.approval_required,
      sequence_no: user.pivot.sequence_no,
    }));

    setApproversData(selectedApproversData);

    form.setFieldsValue({
      name: record.name,
      users: selectedApproversData.map(data => data.users),
      approval_required: selectedApproversData.map(data => data.approval_required),
      sequence_no: selectedApproversData.map(data => data.sequence_no),
    });
  };


  const getApprovers = async (page = 1, itemsPerPage) => {
    setLoading(true);
    try {
      const response = await approverService.getApprovers(page, itemsPerPage);
      console.log(response)
      setData(response.data);
      setCurrentPage(page);
      setTotalDataCount(response.meta.total);
      setItemsPerPage(response.meta.per_page);
      setLoading(false);
      const mappedUserData = response.map((approver) => {
        if (approver.id && approver.users) {
          return { [approver.id]: approver.users };
        }
        return {};
      });

      setUserData(Object.assign({}, ...mappedUserData));
    } catch (error) {
    }
  };


  useEffect(() => {
    getApprovers();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        sequence_no: values.sequence_no.map(Number),
      };

      if (edit) {
        const response = await approverService.updateApprover(edit.id, updatedValues);
        if (response.success) {
          setIsModalVisible(false);
          setEdit(null);
          form.resetFields();
          notification.success({
        message: 'Approver Updated',
        description: response.message,
          });
          getApprovers(currentPage);
        }
      } else {
        const response = await approverService.postApprover(updatedValues);
        if (response.success) {
          setIsModalVisible(false);
          setEdit(null);
          form.resetFields();
          notification.success({
        message: 'Approver Added',
        description: response.message,
          });
          getApprovers(currentPage);
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
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Approvers List',
      dataIndex: 'users',
      key: 'users',
      width: 920,
      sorter: (a, b) => a.users.length - b.users.length, // Example sorter based on users count
      render: (users) => (
        <div>
          {users.map((user, index) => (
            <span className='mr-10' key={`avatar-${user.id}-${index}`}>
              <Tooltip title={`sequence no # ${user.pivot.sequence_no}`}>
                <Badge count={user.name} color={user.pivot.approval_required === 1 ? 'red' : 'blue'} />
              </Tooltip>
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'Actions',
      width: 80,
      fixed: 'right',
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


  const removeApproversAndPermissions = (index) => {
    setApproversData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const renderApproversAndPermissions = () => {
    return approversData.map((data, index) => (
      <div key={`approver-permission-${index}`}>
        <Card size='small' title={<span><Badge color='#2d77fa' count={index + 1} /> Approvers and permissions</span>} className='mb-10'>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item
                name={['users', index]}
                label={`Approver ${index + 1}`}
                rules={[
                  { required: true, message: 'Please select an Approver' },
                ]}
              >
                <Select
                  showSearch={true}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                  size="large"
                  allowClear
                >
                  {users &&
                    users.map((user) => (
                      <Select.Option key={user.id} value={user.id}>
                        {user.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={['approval_required', index]}
                label={`Permission ${index + 1}`}
                rules={[
                  { required: true, message: 'Please select a Permission' },
                ]}
              >
                <Select showSearch={true} optionFilterProp="children" style={{ width: '100%' }} size='large'>
                  <Option value={1}>Required</Option>
                  <Option value={0}>Optional</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={['sequence_no', index]}
                label={`Sequence No ${index + 1}`}
                rules={[
                  { required: true, message: 'Sequence Number is required' },
                ]}
              >
                <Input size='large' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {index > 0 && (
          <div className='textRight mb-10'>
            <Button type="dashed" onClick={() => removeApproversAndPermissions(index)}>Remove</Button>
          </div>
        )}
      </div>
    ));
  };

  const handleAddApproversAndPermissions = () => {
    setApproversData((prevData) => [...prevData, { approver: undefined, permission: 1 }]);
  };

  const handleAddApproversAndPermissionsForNewRecord = () => {
    setApproversData((prevData) => [{ approver: undefined, permission: 1 }]);
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UsergroupAddOutlined />}
            title="Approvers"
            right={(
              <Button className='btn-blue' type="primary" onClick={() => {
                showModal();
                handleAddApproversAndPermissionsForNewRecord();
              }
              }>
                Add Approver
              </Button>
            )}
          />
        </Col>
      </Row>

      <Card title={<>Indicators: <Badge color='red' count="Required" /> <Badge color='blue' count="Optional" /> </>}>
        <Table
          style={{ minHeight: '100vh' }}
          loading={loading}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          scroll={{
            x: 1800,
          }}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getApprovers(page, pageSize),
          }}
        />
      </Card>

      <Modal
        style={{ top: 14 }}
        title={edit ? 'Edit Approver' : 'Add Approver'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className='mt-20'>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[
              { required: true, message: 'Please enter the group name' },
            ]}
          >
            <Input size='large' />
          </Form.Item>

          {renderApproversAndPermissions()}

          <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-20'>
            <Button type="dashed" onClick={handleAddApproversAndPermissions}>
              Add Approver and Permission
            </Button>
          </div>

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

export default Approvers;

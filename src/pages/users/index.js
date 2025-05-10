import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Avatar,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Card,
  Checkbox,
  notification,
  Menu,
  Dropdown,
  Tag,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import './index.css';
import DefaultLayout from './../../components/layout/DefaultLayout';
import Header from '../../components/header';
import userService from '../../services/user';
import sectionService from '../../services/section';
import roleService from '../../services/role';
import authService from '../../services/auth';
import auth from '../../services/auth';
import { useMediaQuery } from 'react-responsive';
import { Excel } from 'antd-table-saveas-excel';
import LocationComponent from '../../components/location';
import DesignationComponent from '../../components/designation';
import DepartmentComponent from '../../components/department';
import RoleComponent from '../../components/role';
import CompanyComponent from '../../components/company';


const UsersData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sections, setSections] = useState([]);

  const [selectLoading, setSelectLoading] = useState(false);

  const [roles, setRoles] = useState([]);
  const [isProfilePictureModalVisible, setIsProfilePictureModalVisible] =
    useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showProfilePictureModal = () => {
    setIsProfilePictureModalVisible(true);
  };

  const hideProfilePictureModal = () => {
    setIsProfilePictureModalVisible(false);
  };

  const showChangePasswordModal = (record) => {
    setSelectedUser(record);
    setIsChangePasswordModalVisible(true);
  };

  const hideChangePasswordModal = () => {
    setIsChangePasswordModalVisible(false);
  };

  const onChangePassword = async (values) => {
    setLoading(true);
    try {
      const response = await authService.updatePassword(
        selectedUser.id,
        values
      );
      if (response.success) {
        setLoading(false);
        notification.success({
          message: 'Password Updated',
          description: response.message,
        });
        hideChangePasswordModal();
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  const getDepartmentOfSection = async (departmentId) => {
    setSelectLoading(true);
    try {
      const response = await sectionService.getDepartmentOfSection(
        departmentId
      );
      console.log('Department sections:', response);

      if (Array.isArray(response) && response.length > 0) {
        setSections(response);
      } else {
        setSections([]);
        form.setFieldsValue({
          section_id: null,
        });
      }
    } catch (error) {
      console.error('Error fetching department sections:', error);
      notification.error({
        message: 'Error',
        description: error.response ? error.response : 'An error occurred',
      });
    } finally {
      setSelectLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const response = await roleService.getRoles();
      setRoles(response);
    } catch (error) {}
  };

  useEffect(() => {
    getRoles();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      company_id: record.company?.id,
      designation_id: record.designation.id,
      employee_no: record.employee_no,
      employee_type: record.employee_type,
      extension: record.extension,
      phone_number: record.phone_number,
      location_id: record.location.id,
      role_id: record.roles.map((role) => role.id),
      department_id: record.department.id,
    });

    setSelectLoading(true);
    getDepartmentOfSection(record.department.id);

    form.setFieldsValue({
      section_id: record.section.id,
    });

    showModal();
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    showModal();
  };

  const getUsers = async (page = 1, itemsPerPage = 15, searchQuery = '') => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(
        page,
        itemsPerPage,
        searchQuery
      );
      setData(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalDataCount(response.meta.total);
      setItemsPerPage(response.meta.per_page);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleTableChange = (pagination) => {
    getUsers(pagination.current, itemsPerPage, searchQuery);
  };

  const handleInputChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    if (newSearchQuery.length > 2 || newSearchQuery === '') {
      getUsers(1, itemsPerPage, newSearchQuery);
    }
  };

  const handleClick = () => {
    const excelColumns = columns
      .filter((column) => column.key !== 'Actions')
      .map((column) => {
        const { render, ...columnWithoutRender } = column;
        return columnWithoutRender;
      });

    const excel = new Excel();
    excel
      .addSheet('data')
      .addColumns(excelColumns)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs('Excel.xlsx');
  };

  const onFinish = async (values) => {
    //console.log(values)
    try {
      setLoading(true);
      let response;
      if (editingUser) {
        response = await auth.updateProfile(editingUser.id, values);
      } else {
        response = await userService.register(values);
      }
      setIsModalVisible(false);
      getUsers();
      notification.success({
        message: 'Profile',
        description: response.message,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Full Name',
      key: 'name',
      dataIndex: 'name',
      width: 260,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      render: (text, record) => {
        {console.log('yeh hain users ', record)}
        return (
          <div>
            <Avatar
              size={32}
              className="mr-10"
              src={
                record?.profile_photo_path
              }
              icon={
                !record?.profile_photo_path && <UserOutlined /> // Correct the condition here
              }
            />
            {text && <span>{text}</span>}
          </div>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 300,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },

    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 160,
      sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: 'Location',
      dataIndex: ['location', 'name'],
      key: 'location',
      sorter: (a, b) => a.location.name.localeCompare(b.location.name),
      width: 140,
    },
    {
      title: 'Total Investment',
      dataIndex: ['department', 'name'],
      key: 'department_id',
      width: 150,
      sorter: (a, b) => a.department.name.localeCompare(b.department.name),
    },
    {
      title: 'Total Profit',
      dataIndex: ['section', 'name'],
      key: 'section',
      width: 120,
      sorter: (a, b) => a.section.name.localeCompare(b.section.name),
    },
    {
      title: 'Status',
      dataIndex: ['section', 'name'],
      key: 'section',
      width: 120,
      sorter: (a, b) => a.section.name.localeCompare(b.section.name),
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      width: 100,
      sorter: (a, b) => {
        const roleNamesA = (a.roles || []).map((role) => role.name).join(', ');
        const roleNamesB = (b.roles || []).map((role) => role.name).join(', ');
        return roleNamesA.localeCompare(roleNamesB);
      },
      render: (text, record) => (
        <>
          {record.roles.map((role) => (
            <Tag color={role.color} key={role.id}>
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'Actions',
      width: 80,
      render: (text, record) => (
        <Space>
           <div onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }}>
           <EyeOutlined />
          </div>
          <div onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }}>
            <EditOutlined />
          </div>

          <div
            onClick={() => showChangePasswordModal(record)}
            style={{ cursor: 'pointer' }}
          >
            <LockOutlined />
          </div>

          {/* <div
         onClick={() => showProfilePictureModal(record)}
     style={{ cursor: 'pointer' }}
   >
     <UserOutlined   /> 
   </div> */}

          {/* <div
     onClick={() => handleDelete(record)}
     style={{ cursor: 'pointer' }}
   >
     <DeleteOutlined /> 
   </div> */}
        </Space>
      ),
      fixed: 'right',
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(() =>
    columns.map((column) => column.key)
  );

  const menu = (
    <Menu>
      {columns.map((column) => (
        <Menu.Item key={column.key}>
          <Checkbox
            className="mr-5"
            style={{ fontSize: '12px' }}
            onChange={() => handleColumnToggle(column.key)}
            checked={visibleColumns.includes(column.key)}
          >
            {column.title}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleColumnToggle = (key) => {
    const updatedVisibleColumns = [...visibleColumns];

    if (visibleColumns.includes(key)) {
      const index = updatedVisibleColumns.indexOf(key);
      if (index > -1) {
        updatedVisibleColumns.splice(index, 1);
      }
    } else {
      updatedVisibleColumns.push(key);
    }

    setVisibleColumns(updatedVisibleColumns);

    try {
      localStorage.setItem(
        'visibleColumns',
        JSON.stringify(updatedVisibleColumns)
      );
    } catch (error) {
      console.error('Error saving visibleColumns to local storage:', error);
    }
  };

  useEffect(() => {
    try {
      const savedVisibleColumns = localStorage.getItem('visibleColumns');
      if (savedVisibleColumns) {
        setVisibleColumns(JSON.parse(savedVisibleColumns));
      }
    } catch (error) {
      console.error('Error loading visibleColumns from local storage:', error);
    }
  }, []);

  const handleAction = (record) => {};

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UserOutlined />}
            title="Users"
            right={
              <>
                <Button onClick={handleClick} className="mr-10">
                  Export
                </Button>

                <Button
                  type="primary"
                  className="btn-blue"
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </>
            }
          />
        </Col>
      </Row>

      <Card>
        <Input
          size="large"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </Card>

      <Card>
        <Dropdown
          className="mr-10"
          overlay={menu}
          open={visible}
          onOpenChange={(isVisible) => setVisible(isVisible)}
          trigger={['click']}
        >
          <a
            style={{ color: 'black', fontSize: '11px', color: 'gray' }}
            onClick={(e) => e.preventDefault()}
          >
            <UnorderedListOutlined /> Columns
          </a>
        </Dropdown>

        <Table
          style={{ minHeight: '100vh' }}
          onChange={handleTableChange}
          columns={columns.filter((column) =>
            visibleColumns.includes(column.key)
          )}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          rowKey={(record) => record.key}
          scroll={{ x: 1200 }}
          sticky={true}
          pagination={{
            showSizeChanger: false,
            current: currentPage,
            total: totalDataCount,
            pageSize: itemsPerPage,
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={null}
        open={isChangePasswordModalVisible}
        onCancel={hideChangePasswordModal}
        footer={null}
      >
        <Form
          autoComplete="off"
          form={formPassword}
          onFinish={onChangePassword}
          layout="vertical"
        >
          <Row gutter={[12, 12]}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Passwords do not match');
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Change Password
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* <Modal
          title="Profile Picture"
          open={isProfilePictureModalVisible}
          onCancel={hideProfilePictureModal}
          footer={null}
        >
          <div style={{textAlign: 'center'}}><ProfilePictureComponent user_id={data.id} size={120} /></div>
        </Modal> */}

      <div>
        <Modal
          title={editingUser ? 'Edit User' : 'Add User'}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          style={{
            top: 20,
          }}
        >
          <Form
            autoComplete="off"
            form={form}
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            className="mt-20"
          >
            <Card size="small" className="mb-10" title="Personal Information">
              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                      { required: true, message: 'Please enter the full name' },
                    ]}
                  >
                    <Input size="large" placeholder="Full Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[12, 12]}>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter the email' },
                      { type: 'email', message: 'Invalid email address' },
                    ]}
                  >
                    <Input size="large" placeholder="Email" />
                  </Form.Item>
                </Col>

                <Col lg={12} md={12} sm={12} xs={24}>
                  <Form.Item name="phone_number" label="Phone">
                    <Input size="large" placeholder="Phone" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    name="name"
                    label="Address"
                  >
                    <Input size="large" placeholder="Please enter address" />
                  </Form.Item>
                </Col>
              </Row>
              <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="location_id"
                    label="Location"
                    rules={[
                      { required: true, message: 'Please select a location' },
                    ]}
                  >
                    <LocationComponent all={true} />
                  </Form.Item>
                </Col>
            </Card>
            <Card size="small" className="mb-10" title="Account Details">
              <Row gutter={[12, 12]}>
                <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="extension" label="Bank Name">
                    <Input size="large" placeholder="Bank Name" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="extension" label="Account Number">
                    <Input size="large" placeholder="Account Number" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="extension" label="Account Title">
                    <Input size="large" placeholder="Title" />
                  </Form.Item>
                </Col>
              </Row>

            </Card>

            {!editingUser && (
              <Card size="small" className="mb-10" title="Password Section">
                <Row gutter={[12, 12]}>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please enter a password' },
                        {
                          min: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      ]}
                    >
                      <Input.Password size="large" placeholder="Password" />
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="password_confirmation"
                      label="Confirm Password"
                      dependencies={['password']}
                      rules={[
                        {
                          required: true,
                          message: 'Please confirm your password',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject('Passwords do not match');
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Confirm Password"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )}
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingUser ? 'Save Changes' : 'Add User'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UsersData;

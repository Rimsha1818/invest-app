import React, { useState, useRef, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  Select,
  notification,
  Space,
  Tag,
} from 'antd';
import {
  AppstoreAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import roleService from '../../services/role';
import permissionService from '../../services/permission';

const { Option } = Select;

const Roles = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [data, setData] = useState([]);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getRoles = async (page = 1) => {
    setLoading(true);

    await roleService.getRoles().then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  const getPermissions = async (page = 1) => {
    setLoading(true);

    await permissionService.getPermissions().then((permissions) => {
      setPermissions(permissions);
    });
  };

  useEffect(() => {
    getRoles();
    getPermissions();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return record.name.toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text}
        />
      ) : (
        text
      ),
  });

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
      permissions: record.permissions.map((permission) => permission.id),
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        const response = await roleService.updateRole(editing.id, values);

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: 'Role Updated',
            description: response.message,
          });
          getRoles(currentPage);
        }
      } else {
        const response = await roleService.postRole(values);
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();

          notification.success({
            message: 'Role Added',
            description: response.message,
          });

          getRoles(currentPage);
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
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      // ...getColumnSearchProps('name'),
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
            icon={<AppstoreAddOutlined />}
            title="Roles"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Role
              </Button>
            }
          />
        </Col>
      </Row>

      <Card>
        <Table
          style={{ minHeight: '100vh' }}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getRoles(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Role' : 'Add Role'}
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
            label="Role Name"
            rules={[{ required: true, message: 'Please enter the role name' }]}
          >
            <Input size="large" placeholder="Type Role Name" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select permissions' }]}
          >
            <Select
              showSearch={true}
              optionFilterProp="children"
              mode="multiple"
              size="large"
              placeholder="Please Select"
            >
              {permissions.map((permission) => (
                <Option key={permission.id} value={permission.id}>
                  {permission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? 'Save Changes' : 'Add Role'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default Roles;

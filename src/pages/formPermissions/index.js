import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Card,
  notification,
  Select,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import formPermissionService from '../../services/formPermission';
import locationService from '../../services/location';
import departmentService from '../../services/department';
import { useMediaQuery } from 'react-responsive';
import formService from '../../services/form'; 

const { Option } = Select;

const FormPermissions = () => {
  const [edit, setEdit] = useState(null);
  const [permissionData, setPermissionData] = useState([
    { name: undefined, depenedent_id: undefined, depenedent_key: undefined },
  ]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dynamicValues, setDynamicValues] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [forms, setForms] = useState(null);

  const fetchData = async () => {
    const response = await formService.getForms();
    setForms(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEdit(null);
    form.resetFields();
  };

  useEffect(() => {
    getFormPermissions();
  }, []);

  const getFormPermissions = async () => {
    try {
      setLoading(true);
      const response = await formPermissionService.getPermissions();
      console.log(response);
      setData(response);
      //console.log(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form permissions:', error);
    }
  };



  const handleSetupFieldChange = async (value, currentIndex) => {
    const dependent_id = parseInt(value);
    setSelectLoading(true);
    try {
      let updatedDynamicValues = [...dynamicValues];
      if (dependent_id === 2) {
        updatedDynamicValues[currentIndex] =
          await locationService.getAllLocations();
      } else if (dependent_id === 1) {
        updatedDynamicValues[currentIndex] =
          await departmentService.getAllDepartments();
      }
      setDynamicValues(updatedDynamicValues);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setSelectLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the record?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await formPermissionService.deletePermission(
            record.id
          );
          if (response.success) {
            notification.success({
              message: 'Permission Deleted',
              description: response.message,
            });
            getFormPermissions(currentPage);
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

  
  const handleEdit = async (record) => {
    setEdit(record);
    setLoading(true);
    try {
      const form_name = record.form_role_name;
      const formIds = record.permissions.map((permission) => permission.form.id);
      const dependentKeys = record.permissions.map((permission) => permission.type.name);
      const dependentIds = record.permissions.map((permission) => permission.form_permissionable.id);
  
      const selectedPermissions = record.permissions.map((permission) => ({
        form: permission.form.id,
      }));
  
      setPermissionData(selectedPermissions);
  
      form.setFieldsValue({
        name: form_name,
        form_ids: formIds,
        dependent_keys: dependentKeys,
        dependent_ids: dependentIds,
      });
  
      const dynamicValuesPromises = dependentIds.map(async (id, index) => {
        let dynamicValues = [];
        let defaultSelectedKey = '';
  
        if (dependentKeys[index] === "Location") {
          dynamicValues = await locationService.getAllLocations();
          defaultSelectedKey = "2"; 
        } else if (dependentKeys[index] === "Department") {
          dynamicValues = await departmentService.getAllDepartments();
          defaultSelectedKey = "1"; 
        }
  
        setDynamicValues((prevDynamicValues) => {
          const updatedDynamicValues = [...prevDynamicValues];
          updatedDynamicValues[index] = dynamicValues;
          return updatedDynamicValues;
        });
  
        const currentDependentKeys = form.getFieldValue('dependent_keys') || [];
        form.setFieldsValue({
          dependent_keys: [...currentDependentKeys.slice(0, index), defaultSelectedKey, ...currentDependentKeys.slice(index + 1)],
        });
        return dynamicValues;
      });
  
      const dynamicValues = await Promise.all(dynamicValuesPromises);
      setDynamicValues(dynamicValues);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsModalVisible(true);
    }
  };
  

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      if (edit) {
        const response = await formPermissionService.updatePermission(
          edit.id,
          values
        );
        if (response.success) {
          setIsModalVisible(false);
          setEdit(null);
          form.resetFields();
          notification.success({
            message: 'Permission Updated',
            description: response.message,
          });
          getFormPermissions(currentPage);
        }
      } else {
        const response = await formPermissionService.postPermission(values);
        if (response.success) {
          setIsModalVisible(false);
          setEdit(null);
          form.resetFields();
          notification.success({
            message: 'Permission Added',
            description: response.message,
          });
          getFormPermissions(currentPage);
        }
      }
    } catch (error) {
      console.log(error);
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
      dataIndex: 'form_role_name',
      key: 'form_role_name',
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      sorter: (a, b) => a.form_role_name.localeCompare(b.form_role_name),
    },
    {
      title: 'Form',
      dataIndex: 'permissions',
      key: 'forms',
      sorter: (a, b) => {
        const formNamesA = (a.permissions || []).map(permission => permission.form.name).join(', ');
        const formNamesB = (b.permissions || []).map(permission => permission.form.name).join(', ');
        return formNamesA.localeCompare(formNamesB);
      },
      render: (permissions) => (
        <span>{permissions.map((permission) => permission.form.name).join(', ')}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'permissions',
      key: 'types',
      sorter: (a, b) => {
        const typeNamesA = (a.permissions || []).map(permission => permission.type.name).join(', ');
        const typeNamesB = (b.permissions || []).map(permission => permission.type.name).join(', ');
        return typeNamesA.localeCompare(typeNamesB);
      },
      render: (permissions) => (
        <span>{permissions.map((permission) => permission.type.name).join(', ')}</span>
      ),
    },
    {
      title: 'Form Permissionable',
      dataIndex: 'permissions',
      key: 'form_permissionables',
      sorter: (a, b) => {
        const permissionablesA = (a.permissions || []).map(permission => permission.form_permissionable.name).join(', ');
        const permissionablesB = (b.permissions || []).map(permission => permission.form_permissionable.name).join(', ');
        return permissionablesA.localeCompare(permissionablesB);
      },
      render: (permissions) => (
        <span>{permissions.map((permission) => permission.form_permissionable.name).join(', ')}</span>
      ),
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
          <div onClick={() => handleDelete(record)} style={{ cursor: 'pointer' }}>
            <DeleteOutlined />
          </div>
        </Space>
      ),
    },
  ];
  
  const removePermissions = (index) => {
    setPermissionData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const renderPermissions = () => {
    return permissionData.map((data, index) => (
      <Card
        key={`permission-${index}`}
        size="small"
        title={
          <span>
            <Badge color="#2d77fa" count={index + 1} /> Permissions
          </span>
        }
        className="mb-10"
      >
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Form.Item
              label="Form Name"
              name={['form_ids', index]}
              rules={[{ required: true, message: 'Please select a form!' }]}
            >
              <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      allowClear
      placeholder="Select a form"
    >
      {forms &&
        forms.map((option) => (
          <Select.Option key={option.id} value={option.id}>
            {option.name}
          </Select.Option>
        ))}
    </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={['dependent_keys', index]}
              label="Setup Field"
              rules={[
                { required: true, message: 'Please select setup fields!' },
              ]}
            >
              <Select
                size="large"
                placeholder="Select setup fields"
                onChange={(value) => handleSetupFieldChange(value, index)}
              >
                <Option value="1">Department</Option>
                <Option value="2">Location</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Setup Value"
              name={['dependent_ids', index]}
              rules={[
                {
                  required: true,
                  message: 'Please select setup values!',
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                placeholder="Select setup values"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {dynamicValues[index] &&
                  dynamicValues[index].map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {index > 0 && (
          <div className="textRight mb-10">
            <Button type="dashed" onClick={() => removePermissions(index)}>
              Remove
            </Button>
          </div>
        )}
      </Card>
    ));
  };

  const handleAddPermissions = () => {
    setPermissionData((prevData) => [
      ...prevData,
      { name: undefined, depenedent_id: undefined, depenedent_key: undefined },
    ]);
  };

  const handleAddPermissionGroup = () => {
    setPermissionData((prevData) => [
      { name: undefined, depenedent_id: undefined, depenedent_key: undefined },
    ]);
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UsergroupAddOutlined />}
            title="Form Permissions"
            right={
              <Space>
                <Button
                  className="btn-blue"
                  type="primary"
                  onClick={() => {
                    showModal();
                    handleAddPermissionGroup();
                  }}
                >
                  Add Permission Group
                </Button>
              </Space>
            }
          />
        </Col>
      </Row>

      <Card>
        <Table
          scroll={{ x: 1000 }}
          style={{ minHeight: '100vh' }}
          loading={loading}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
          }}
        />
      </Card>

      <Modal
        style={{ top: 14 }}
        title={edit ? 'Edit Permission' : 'Add Permission'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="mt-20"
        >
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter the group name' }]}
          >
            <Input size="large" />
          </Form.Item>

          {renderPermissions()}

          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="mb-20"
          >
            <Button type="dashed" onClick={handleAddPermissions}>
              Add Permission
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

export default FormPermissions;

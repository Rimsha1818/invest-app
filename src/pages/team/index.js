import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Select,
  Card,
  notification,
  Badge,
  Tag,
} from 'antd';
import {
  UsergroupAddOutlined,
  EditOutlined,
} from '@ant-design/icons';
import teamGroupService from '../../services/teamGroup';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { useMediaQuery } from 'react-responsive';
import FormListComponent from './../../components/formList/index';
import UserComponent from './../../components/user/index';
import LocationComponent from './../../components/location/index';

const TeamGroup = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [managerData, setManagerData] = useState([
    { forms: undefined, locations: undefined, managers: undefined },
  ]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEdit(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    console.log(record);
    setEdit(record);
    setIsModalVisible(true);
    const selectedManagerData = record.forms.map((form) => ({
      forms: form.id,
    }));

    setManagerData(selectedManagerData);

    form.setFieldsValue({
      name: record.name,
      form_ids: record.forms.map((form) => form.id),
      location_ids: record.locations.map((location) => location.id),
      manager_ids: record.managers.map((manager) => manager.id),
    });
  };

  const getManagers = async (page = 1) => {
    setLoading(true);

    try {
      const response = await teamGroupService.getManagersUP();
       console.log('this is ress')
      console.log(response)
      console.log('this is ress')
      setData(response.data);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);

      const mappedUserData = response.map((approver) => {
        if (approver.id && approver.users) {
          return { [approver.id]: approver.users };
        }
        return {};
      });

      setUserData(Object.assign({}, ...mappedUserData));
    } catch (error) {}
  };

  useEffect(() => {
    getManagers();
  }, []);

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      if (edit) {
        const response = await teamGroupService.updateManager(edit.id, values);
        if (response.success) {
          
          setIsModalVisible(false);
          setEdit(null);

          form.resetFields();

          notification.success({
            message: 'Manager Updated',
            description: response.message,
          });

          getManagers(currentPage);
        }
      } else {
        console.log("values", values)
        const response = await teamGroupService.postManager(values);

        if (response.success) {
          setIsModalVisible(false);
          setEdit(null);

          form.resetFields();

          notification.success({
            message: 'Manager Added',
            description: response.message,
          });

          getManagers(currentPage);
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
      dataIndex: 'name',
      key: 'name',
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Forms',
      dataIndex: 'forms',
      key: 'forms',
      render: (forms) => (
        <div>
          {forms.map((form, index) => (
            <div key={index}><Tag>{form.name}</Tag></div>
          ))}
        </div>
      ),
      sorter: (a, b) => {
        const formNamesA = a.forms.map(form => form.name).join(', ');
        const formNamesB = b.forms.map(form => form.name).join(', ');
        return formNamesA.localeCompare(formNamesB);
      },
    },
    {
      title: 'Manager',
      dataIndex: 'managers',
      key: 'managers',
      render: (managers) => (
        <div>
          {managers.map((manager, index) => (
            <div key={index}><Tag>{manager.name}</Tag></div>
          ))}
        </div>
      ),
      sorter: (a, b) => {
        const managerNamesA = a.managers.map(manager => manager.name).join(', ');
        const managerNamesB = b.managers.map(manager => manager.name).join(', ');
        return managerNamesA.localeCompare(managerNamesB);
      },
    },
    {
      title: 'Locations',
      dataIndex: 'locations',
      key: 'locations',
      render: (locations) => (
        <div>
          {locations.map((location, index) => (
            <div key={index}><Tag>{location.name}</Tag></div>
          ))}
        </div>
      ),
      sorter: (a, b) => {
        const locationNamesA = a.locations.map(location => location.name).join(', ');
        const locationNamesB = b.locations.map(location => location.name).join(', ');
        return locationNamesA.localeCompare(locationNamesB);
      },
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
        </Space>
      ),
    },
  ];
  

  const handleAvatarClick = (avatar) => {};

  const removeManagerGroup = (index) => {
    setManagerData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const renderManagerDetails = () => {
    return managerData.map((data, index) => (
      <div key={`team-group-${index}`}>
        <Card
          size="small"
          title={
            <span>
              <Badge color="#2d77fa" count={index + 1} /> Manager Details
            </span>
          }
          className="mb-10"
        >
          <Row gutter={[12, 12]}>
            <Col span={8}>
              <Form.Item
                name={['form_ids', index]}
                label={`Form`}
                rules={[{ required: true, message: 'Please select Form' }]}
              >
                <FormListComponent />
              </Form.Item>
            </Col>
  
            <Col span={8}>
              <Form.Item
                name={['manager_ids', index]}
                label={`Manager`}
                rules={[{ required: true, message: 'Please select Manager' }]}
              >
                <UserComponent />
              </Form.Item>
            </Col>
  
            <Col span={8}>
              <Form.Item
                name={['location_ids', index]}
                label={`Location`}
                rules={[{ required: true, message: 'Please select Location' }]}
              >
               <LocationComponent all />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {index > 0 && (
          <div className="textRight mb-10">
            <Button type="dashed" onClick={() => removeManagerGroup(index)}>
              Remove
            </Button>
          </div>
        )}
      </div>
    ));
  };

  const handleAddManager = () => {
    setManagerData((prevData) => [
      ...prevData,
      { forms: undefined, locations: undefined, managers: undefined },
    ]);
  };

  const handleAddManagerForNewRecord = () => {
    setManagerData((prevData) => [{ forms: undefined, locations: undefined, managers: undefined }]);
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UsergroupAddOutlined />}
            title="Create Team"
            right={
              <Button
                className="btn-blue"
                type="primary"
                onClick={() => {
                  showModal();
                  handleAddManagerForNewRecord();
                }}
              >
                Add Team Group
              </Button>
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
  rowKey={(record) => record.key}
  pagination={{
    total: totalDataCount,
    current: currentPage,
    pageSize: itemsPerPage,
    onChange: (page, pageSize) => getManagers(page),
  }}
/> 

      </Card>

      <Modal
        style={{ top: 14 }}
        title={edit ? 'Edit Manager' : 'Add Team Group'}
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

          {renderManagerDetails()}

          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="mb-20"
          >
            <Button type="dashed" onClick={handleAddManager}>
              Add Team Manager
            </Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {edit ? 'Save Changes' : 'Add Team Group'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default TeamGroup;

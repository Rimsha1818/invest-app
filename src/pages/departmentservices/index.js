import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, Card, Space, notification, Tag } from 'antd';
import { AppstoreAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { useSelector } from 'react-redux';

// import subCategoryService from '../../services/subCategory';
import SimpleCategoryComponent from './../../components/simpleCategory/index';
import depServices from '../../services/depServices';
import ServiceComponent from '../../components/service';
import DepartmentComponent from '../../components/department';



const DepServices = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [serviceIds, setServiceIds] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const defaultDeparmentId = currentUser ? currentUser.department.id : null;


  const getDepServices = async (page = 1) => {
    setLoading(true);
    await depServices.getDepServices(page).then((response) => {
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
      content: `Are you sure you want to delete the service: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await depServices.deleteSubcategory(record.id);
          if (response.success) {
            notification.success({
              message: 'service Deleted',
              description: response.message,
            });
            getDepServices(currentPage);
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
    getDepServices();
  }, []);
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const handleServiceChange = (values) => {
    form.setFieldValue('service_ids', values);
    setServiceIds(values); 
  };


  const handleEdit = (record) => {
    setEditing(record);
    setIsModalVisible(true);
    setCurrentId(record.id);
    const serviceIds = record.services.map((service) => service.id);
    // setServiceIds(serviceIds);
    form.setFieldsValue({
      service_ids: serviceIds
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
  
    try {
      const response = await depServices.postAttachServices(currentId, values);
      if (response.id) {
        setIsModalVisible(false);
        setEditing(null);
        form.resetFields();
        notification.success({
          message: ' Added',
          description: "Services Attached",
        });
        getDepServices(currentPage);
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
      title: 'Departments',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (services) => {
        return services.length > 0 ? (
          services.map((service) => (
            <Tag key={service.id} color="green">
              {service.name}
            </Tag>
          ))
        ) : (
          <Tag color="red">No Services</Tag>
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
 
     {/*<div
       onClick={() => handleDelete(record)}
       style={{ cursor: 'pointer' }}
     >
       <DeleteOutlined /> 
     </div>*/}
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
            title="Department Services"
            // right={(
            //   <Button className='btn-blue' type="primary" onClick={showModal}>
            //     Add Service To Department </Button>
            // )}
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
          onChange: (page, pageSize) => getDepServices(page),
        }}
        loading={loading} 
      />
      </Card>

      <Modal
        title={editing ? 'Attach Service to Department' : 'Attach Service to Department'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={650}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className='mt-20'>
         
          
         {/*<Form.Item
            name="department_id"
            label="Department"
            // initialValue={defaultDeparmentId}
            rules={[
              { required: true, message: 'Please select a Department' },
            ]}>
          
              <DepartmentComponent all={true} />
          </Form.Item>*/}
          <Form.Item
            name="service_ids"
            label="Service"
            rules={[
              { required: true, message: 'Please select a Service' },
            ]}
          >
          <ServiceComponent
          multi={true}
          value={serviceIds}
          onChange={handleServiceChange}
                    />
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

export default DepServices;

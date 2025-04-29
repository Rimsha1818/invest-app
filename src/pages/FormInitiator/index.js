import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, Card, Space, notification, Tag } from 'antd';
import { AppstoreAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { useSelector } from 'react-redux';

import SimpleCategoryComponent from './../../components/simpleCategory/index';

import servicesTeams from '../../services/serviceTeams';
// import ServiceComponent from '../../components/service';
import TeamComponent from '../../components/team';
import DepartmentComponent from '../../components/department';



const FormInits = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [teamIds, setTeamIds] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const defaultDeparmentId = currentUser ? currentUser.department.id : null;


  const getServiceTeams = async (page = 1) => {
    setLoading(true);
    await servicesTeams.getServiceTeams(page).then((response) => {
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
      content: `Are you sure you want to delete the teams: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await servicesTeams.deleteSubcategory(record.id);
          if (response.success) {
            notification.success({
              message: 'teams Deleted',
              description: response.message,
            });
            getServiceTeams(currentPage);
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
    getServiceTeams();
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
    form.setFieldValue('team_ids', values);
    setTeamIds(values); 
  };


  const handleEdit = (record) => {
    setEditing(record);
    setIsModalVisible(true);
    setCurrentId(record.id);
    const teamIds = record.teams.map((team) => team.id);
    // setTeamIds(teamIds);
    form.setFieldsValue({
      team_ids: teamIds
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
  
    try {
      const response = await servicesTeams.postAttachTeams(currentId, values);
      if (response.id) {
        setIsModalVisible(false);
        setEditing(null);
        form.resetFields();
        notification.success({
          message: ' Added',
          description: "Teams Attached",
        });
        getServiceTeams(currentPage);
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
      title: 'Form',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Categories',
      dataIndex: 'teams',
      key: 'teams',
      render: (teams) => {
        return teams.length > 0 ? (
          teams.map((team) => (
            <Tag key={team.id} color="green">
              {team.name}
            </Tag>
          ))
        ) : (
          <Tag color="red">No Teams</Tag>
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
 
  {/* <div
     onClick={() => handleDelete(record)}
     style={{ cursor: 'pointer' }}
   >
     <DeleteOutlined /> 
   </div>*/}
   </Space>
      ),
    },
  ];

  
  console.log(data)
  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<AppstoreAddOutlined/>}
            title="Form Initiators"
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
          onChange: (page, pageSize) => getServiceTeams(page),
        }}
        loading={loading} 
      />
      </Card>

      <Modal
        title={editing ? 'Attach Categories to Form' : 'Attach Categories to Form'}
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
            name="team_ids"
            label="Categories"
            rules={[
              { required: true, message: 'Please select a Categories' },
            ]}
          >
          <TeamComponent
          multi={true}
          value={teamIds}
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

export default FormInits;

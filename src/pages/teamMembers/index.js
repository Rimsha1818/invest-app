import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  notification,
  Space,
  Tag,
} from 'antd';
import { AppstoreAddOutlined, EditOutlined } from '@ant-design/icons';
import teamMemberService from '../../services/teamMember';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import UserComponent from './../../components/user/index';

const TeamMembers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getTeamMembers = async (page = 1) => {
    setLoading(true);
    await teamMemberService.getTeamMembers().then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  useEffect(() => {
    getTeamMembers();
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditing(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      member_ids: record.members.map((member) => member.id),
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        member_ids: values.member_ids,
      };
      console.log(formattedValues);
      const response = await teamMemberService.updateTeamMembers(
        editing.id,
        formattedValues
      );
      if (response.success) {
        setIsModalVisible(false);
        setEditing(null);
        form.resetFields();
        notification.success({
          message: 'Team Member Updated',
          description: response.message,
        });
        getTeamMembers(currentPage);
      }
    } catch (error) {
      console.log(error);
      // notification.error({
      //   message: 'Error',
      //   description: error,
      // });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Team Group',
      dataIndex: 'team_name',
      key: 'team_name',
      sorter: (a, b) => a.team_name.localeCompare(b.team_name),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members) => (
        <>
          {members.map((member) => (
            <Tag key={member.id}>{member.name}</Tag>
          ))}
        </>
      ),
      sorter: (a, b) => {
        const memberNamesA = a.members.map((member) => member.name).join(', ');
        const memberNamesB = b.members.map((member) => member.name).join(', ');
        return memberNamesA.localeCompare(memberNamesB);
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

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<AppstoreAddOutlined />}
            title="Assign Team Members"
            right={
              <>
                {/* <Button className="btn-blue" type="primary" onClick={showModal}>
                Add Team Members
              </Button> */}
              </>
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
          rowKey={(record) => record.key}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getTeamMembers(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Team Member' : 'Add Team Members'}
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
            name="member_ids"
            label="Team Members"
            rules={[{ required: true, message: 'Please select team members' }]}
          >
            <UserComponent mode="multiple" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? 'Save Changes' : 'Add Team Members'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default TeamMembers;

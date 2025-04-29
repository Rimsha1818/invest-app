import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Tag,
  notification,
  Space,
} from 'antd';
import {
  SafetyCertificateOutlined,
  EyeOutlined,
  MessageOutlined,
  EditOutlined,
} from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import qaService from '../../services/qualityAssurance';
import { useMediaQuery } from 'react-responsive';
import { Excel } from 'antd-table-saveas-excel';
import { useSelector } from 'react-redux';
import TableActionBtnsComponent from '../../components/tableActionsBtns';

const { Option } = Select;

const QualityAssurance = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [formStatus] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalStatusVisible, setIsModalStatusVisible] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formId, setFormId] = useState(1);


  const handleStatus = (record) => {
    setIsModalStatusVisible(true);
    formStatus.setFieldsValue({
      id: record.id,
    });
  };

  const onStatusFinish = async (values) => {
    //console.log(values);
    setLoading(true);
    try {
      const response = await qaService.updateQAStatus(values);
      setIsModalStatusVisible(false);
      setEditing(null);
      form.resetFields();
      notification.success({
        message: 'Quality Assurance Updated',
        description: response.message,
      });
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

  const getQA = async (page = 1) => {
    setLoading(true);
    await qaService.getQA().then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  useEffect(() => {
    getQA();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalStatusVisible(false);
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
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

  const columns = [
    {
      title: 'Request Title',
      dataIndex: 'request_title',
      key: 'request_title',
      width: 200,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      sorter: (a, b) => a.form_name.localeCompare(b.form_name),
      render: text => text.length > 40 ? `${text.slice(0, 40)}...` : text,

    },
    // {
    //   title: 'Assigned To Users',
    //   dataIndex: 'assigned_to_users',
    //   key: 'assigned_to_users',
    //   width: 200,
    //   render: (assignedToUsers) => (
    //     <>
    //       {assignedToUsers.map((user) => (
    //         <Tag key={user.id}>{user.name}</Tag>
    //       ))}
    //     </>
    //   ),
    //   sorter: (a, b) => {
    //     const usersA = a.assigned_to_users.map((user) => user.name).join(', ');
    //     const usersB = b.assigned_to_users.map((user) => user.name).join(', ');
    //     return usersA.localeCompare(usersB);
    //   },
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Department',
      dataIndex: ['department', 'name'],
      key: 'department',
      width: 200,
      sorter: (a, b) => a.department.name.localeCompare(b.department.name),
    },
    {
      title: 'Location',
      dataIndex: ['location', 'name'],
      key: 'location',
      width: 200,
      sorter: (a, b) => a.location.name.localeCompare(b.location.name),
    },
    {
      title: 'Designation',
      dataIndex: ['designation', 'name'],
      key: 'designation',
      width: 200,
      sorter: (a, b) => a.designation.name.localeCompare(b.designation.name),
    },
    {
      title: 'Section',
      dataIndex: ['section', 'name'],
      key: 'section',
      width: 200,
      sorter: (a, b) => a.section.name.localeCompare(b.section.name),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 200,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },

    {
      title: 'Actions',
      key: 'Actions',
      fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
      width: 80,
      render: (text, record) => (
        <TableActionBtnsComponent record={record} currentUser={currentUser} formId={formId}
          />
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<SafetyCertificateOutlined />}
            title="Quality Assurance"
            right={
              <>
                <Button onClick={handleClick} className="mr-10">
                  Export
                </Button>

              </>
            }
          />
        </Col>
      </Row>

      <Card>
        <Table
          scroll={{ x: 1200 }}
          sticky={true}
          style={{ minHeight: '100vh' }}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          rowKey={(record) => record.key}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getQA(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title="Quality Assurance Status"
        open={isModalStatusVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={formStatus} onFinish={onStatusFinish} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
              <Option value="Ok">OK</Option>
              <Option value="Modification Required">
                Modification Required
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="feedback"
            label="Feedback"
            rules={[{ required: true, message: 'Please provide feedback' }]}
          >
            <Input.TextArea rows={4} placeholder="Provide feedback" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="btn-blue mr-20"
            >
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default QualityAssurance;

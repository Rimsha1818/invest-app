import React, { useState, useEffect } from 'react';
import {
  Table, Button, Avatar, Modal, Form, Input, Select, Row, Col, Space, Card, Checkbox, notification, Menu, Dropdown, Tag, Upload, message,
} from 'antd';
import {
  UserOutlined, EditOutlined, LockOutlined, UnorderedListOutlined, DeleteOutlined, CodepenOutlined, PlusOutlined,
} from '@ant-design/icons';
import './index.css';
import DefaultLayout from './../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { useMediaQuery } from 'react-responsive';
import { Excel } from 'antd-table-saveas-excel';
import envConfig from '../../env.js';
import activityLogService from '../../services/activityLog';
import FormListComponent from "./../../components/serviceDeskFormList";
import UserComponent from "./../../components/user";
import { useLocation } from "react-router-dom";


const ActiviyLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [form] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sections, setSections] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const flag = envConfig.flag; 

  const baseURL = (envConfig.API_URL || envConfig[flag]?.API_URL).replace(/\/api$/, '');

  const [selectLoading, setSelectLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const location = useLocation();
  const { form_id, key } = location.state || {}; // Destructure the data

  const [formId, setFormId] = useState(form_id || '');
  // const [formId, setFormId] = useState('');

  const getActivities = async (page = 1, itemsPerPage = 15, searchQuery = '') => {
    setLoading(true);
    try {
      const response = await activityLogService.getAllActivities(
        page,
        itemsPerPage,
        searchQuery,
        formId,
        selectedUserId,
        key
      );
      setData(response.data);
      // setCurrentPage(response.meta.current_page);
      // setTotalDataCount(response.meta.total);
      // setItemsPerPage(response.meta.per_page);
      // console.log("yes fetched")
      console.log('response')
      console.log(response)
    } catch (error) {
      console.log(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getActivities();
  }, [formId, selectedUserId]);

  const handleTableChange = (pagination) => {
    getActivities(pagination.current, itemsPerPage, searchQuery);
  };
  const handleFormChange = (selectedValue) => {
    setFormId(selectedValue);
  };
  const handleUserChange = (selectedValue) => {
    setSelectedUserId(selectedValue);
  };

  const handleInputChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    if (newSearchQuery.length > 2 || newSearchQuery === '') {
      getActivities(1, itemsPerPage, newSearchQuery);
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


  const columns = [
     {
      title: 'Status',
      dataIndex: 'event',
      key: 'email',
      width: 40,
      sorter: (a, b) => a.event.localeCompare(b.event),
    },
    {
      title: 'Employee Name',
      dataIndex: 'causer_name',
      key: 'causer_name',
      width: 50,
      sorter: (a, b) => a.causer_name.localeCompare(b.causer_name),
    },
    {
      title: 'Subject Type',
      dataIndex: 'subject_type',
      key: 'causer_name',
      width: 30,
      sorter: (a, b) => a.causer_name.localeCompare(b.causer_name),
      render: (text) => text?.split('\\').pop() || '-', // Extracts the last part of the namespace
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'request_title'],
      key: 'email',
      width: 75,
      render: (_, record) => {
        const requestTitle = record.subject?.request_title || '-';
        const sequenceNo = record.subject?.sequence_no || '-';
        return `${requestTitle} (${sequenceNo})`;
      },
    },
    {
      title: 'Date',
      dataIndex: 'updated_at',
      key: 'email',
      width: 35,
      render: (text) => new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(text)), // e.g., "December 20, 2024, 1:57 PM"
    },
    {
      title: 'Time',
      dataIndex: 'updated_at',
      key: 'email',
      width: 25,
      render: (text) => new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(new Date(text)), // e.g., "December 20, 2024, 1:57 PM"
    },
    {
      title: 'Remarks',
      dataIndex: 'description',
      key: 'causer_name',
      width: 100,
    }

   
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
            title="Activities"
          />
        </Col>
      </Row>

      {!(form_id && key) && (
        <Card>
          <Row gutter={[24, 24]}>

            <Col span={8}>
              <b>Form</b>
              <FormListComponent
              onChange={handleFormChange}
              selectedFormId={formId}
              />
            </Col>
            
            <Col span={8}>
              <b>User</b>
              <UserComponent
              all={true}
              onChange={handleUserChange}
              selectedFormId={selectedUserId}
              />
            </Col>

            <Col span={8}>
              <b>Search by keyword</b>
              <Input
              size="large"
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
              />
            </Col>

          </Row>

        </Card>
      )}

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

   
    </DefaultLayout>
  );
};

export default ActiviyLog;

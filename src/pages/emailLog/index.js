import React, { useState, useEffect } from 'react';
import { Table, Tag, Row, Col, Card, Pagination } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import EmailLogService from '../../services/emailLog';

const EmailLogs = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    fetchEmailLogs(currentPage);
  }, []);

  const fetchEmailLogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await EmailLogService.getEmailLogs(page);
      console.log('Fetched data:', response); // Added for debugging
      
      // Ensure the email logs are in an array format
      const logs = Array.isArray(response.data.data) ? response.data.data : [];
      
      setEmailLogs(logs);
      setCurrentPage(page);
      setTotalDataCount(response.data.total);
      setItemsPerPage(response.data.per_page);
    } catch (error) {
      console.error('Failed to fetch email logs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, pageSize) => {
    fetchEmailLogs(page);
  };

  const columns = [
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'geekblue';
        if (status === 'delivered') color = 'green';
        else if (status === 'failed') color = 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Error Message',
      dataIndex: 'error_message',
      key: 'error_message',
    },
    {
      title: 'Sent At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<MailOutlined />} title="Email Logs" />
        </Col>
      </Row>
      <Card>
        <Table 
          columns={columns} 
          dataSource={emailLogs.map((log) => ({ ...log, key: log.id }))}
          rowKey="id" 
          loading={loading} 
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: handlePageChange,
          }}
        />
      </Card>
    </DefaultLayout>
  );
};

export default EmailLogs;

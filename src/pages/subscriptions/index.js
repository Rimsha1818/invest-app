import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Select, Row, Col, Card, notification, Skeleton, Badge, DatePicker, InputNumber, Tag, Modal,Table} from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined, CodeSandboxOutlined } from '@ant-design/icons';
import currentSubscriptionService from '../../services/currentSubscription';
import Header from '../../components/header';
import DefaultLayout from './../../components/layout/DefaultLayout';
import './index.css';
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [totalData, setTotalData] = useState(null);
  const [fields, setFields] = useState([]);

  const getMySubscriptions = async () => {
    setLoading(true);
    try {
      const response = await currentSubscriptionService.getCurrentSubscription();
      setData(response.subscriptions);
      setTotalData(response.totals);
      setLoading(false);  

      console.log('response')
      console.log(response.subscriptions)
      console.log('response')
    } 
    catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: error.response,
      });
    }
  };

  useEffect(() => {
    getMySubscriptions();
  }, []);


  const columns = [
    {
      title: 'Date Range',
      render: (_, record) => `${record.start_date} - ${record.end_date}`,
      key: 'date_range',
    },
    {
      title: 'Total Transactions',
      dataIndex: 'number_of_transactions',
      key: 'number_of_transactions',
    },
    {
      title: 'Remaining Transactions',
      render: (text, record) => record.number_of_transactions - record.usage_number_of_transactions,
      key: 'remaining_transactions',
    },
    {
      title: 'Total Data (MB)',
      dataIndex: 'data_mb',
      key: 'data_mb',
    },
    {
      title: 'Remaining Data (MB)',
      render: (text, record) => record.data_mb - record.usage_data_mb,
      key: 'remaining_data',
    },
    {
      title: 'Total Users',
      dataIndex: 'total_users',
      key: 'total_users',
    },
    {
      title: 'Remaining Users',
      render: (text, record) => record.total_users - record.usage_total_users,
      key: 'remaining_users',
    },
    {
      title: 'Total Login Users',
      dataIndex: 'login_users',
      key: 'login_users',
    },
    {
      title: 'Remaining Login Users',
      render: (text, record) => record.login_users - record.usage_login_users,
      key: 'remaining_login_users',
    },
    // {
    //   title: 'Usage Transactions',
    //   dataIndex: 'usage_number_of_transactions',
    //   key: 'usage_transactions',
    // },
    // {
    //   title: 'Usage Data (MB)',
    //   dataIndex: 'usage_data_mb',
    //   key: 'usage_data',
    // },
    // {
    //   title: 'Usage Users',
    //   dataIndex: 'usage_total_users',
    //   key: 'usage_users',
    // },
    // {
    //   title: 'Usage Login Users',
    //   dataIndex: 'usage_login_users',
    //   key: 'usage_login_users',
    // },
  ];
  const totalColumns = [
    {
      title: 'Total Transactions',
      dataIndex: 'number_of_transactions',
      key: 'number_of_transactions',
    },
    {
      title: 'Remaining Transactions',
      render: (text, record) => record.number_of_transactions - record.usage_number_of_transactions,
      key: 'remaining_transactions',
    },
    {
      title: 'Total Data (MB)',
      dataIndex: 'data_mb',
      key: 'data_mb',
    },
    {
      title: 'Remaining Data (MB)',
      render: (text, record) => record.data_mb - record.usage_data_mb,
      key: 'remaining_data',
    },
    {
      title: 'Total Users',
      dataIndex: 'total_users',
      key: 'total_users',
    },
    {
      title: 'Remaining Users',
      render: (text, record) => record.total_users - record.usage_total_users,
      key: 'remaining_users',
    },
    {
      title: 'Total Login Users',
      dataIndex: 'login_users',
      key: 'login_users',
    },
    {
      title: 'Remaining Login Users',
      render: (text, record) => record.login_users - record.usage_login_users,
      key: 'remaining_login_users',
    },

  ];
  return (
    <DefaultLayout>

    <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<CodeSandboxOutlined />}
            title="Subscription Details"
            right={
                <div className="text-right" style={{ marginRight: '30px'}}>
            {/*<Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                onClick={() => navigate("/advance-settings")}
              >
                Update Subscription
              </Button>
            </Form.Item>*/}
          </div>
      }
          />
        </Col>
      </Row>

      <Card title=" " className="pt-10 pl-10">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Table dataSource={data} columns={columns} rowKey="id" />
          </Col>
        </Row>
      </Card>

      <Card title=" " className="pt-10 pl-10">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            {/*<Table dataSource={totalData} columns={totalColumns} rowKey="id" />*/}
            {/*<Table dataSource={[totalData]} columns={totalColumns} rowKey="id" />*/}
            <Table dataSource={totalData ? [totalData] : []} columns={totalColumns} rowKey="id" />

          </Col>
        </Row>
      </Card>

     
      {/*</Card>*/}
    </DefaultLayout>
  );
};

export default Settings;
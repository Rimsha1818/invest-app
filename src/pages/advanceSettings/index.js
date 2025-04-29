import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Select, Row, Col, Card, notification, Skeleton, Badge, DatePicker, InputNumber, Tag, Modal,} from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import systemAdvanceService from '../../services/advanceSetting';
import Header from '../../components/header';
import DefaultLayout from './../../components/layout/DefaultLayout';
import moment from 'moment';

import './index.css';
const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [data, setData] = useState(null);
  const [fields, setFields] = useState([]);


  const getSystemSettings = async () => {
    setLoading(true);
    try {
      const response = await systemAdvanceService.getSystemAdvanceSettings();
      setData(response);
      setLoading(false);  

      console.log('response')
      console.log(response)
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
    getSystemSettings();
  }, []);

  useEffect(() => {
    if (data) {
      const transformedFields = data.map((item, index) => ({
        id: index,
        idd: item.id,
        date_range: [moment(item.start_date), moment(item.end_date)], // Convert strings to Moment objects
        transactions: item.number_of_transactions,
        mbs: item.data_mb,
        total_users: item.total_users,
        total_users_loggin: item.login_users,
        package: item.package_id ? `package ${item.package_id}` : null,
      }));

      setFields(transformedFields);

      // Set initial form values
      form.setFieldsValue({
        subscriptions: transformedFields.map((field) => ({
          idd: field.idd,
          date_range: field.date_range,
          transactions: field.transactions,
          mbs: field.mbs,
          total_users: field.total_users,
          total_users_loggin: field.total_users_loggin,
          package: field.package,
        })),
      });
    }
  }, [data, form]);

  const onFinish = async (values) => {

  console.log('values')
  console.log(values)
  console.log('values')

  const subscriptions = values.subscriptions.map((item, index) => ({
    ['id']: item.idd !== undefined ? item.idd : '',
    ['value']: item.package || '',
    ['date_range']: item.date_range[0].format("YYYY-MM-DD"),
    ['date_range2']: item.date_range[1].format("YYYY-MM-DD"),
    ['transactions']: item.transactions,
    ['mbs']: item.mbs,
    ['total_users']: item.total_users,
    ['total_users_loggin']: item.total_users_loggin,
  }));

  const formattedData = new FormData();
  subscriptions.forEach((item, index) => {
    formattedData.append(`subscriptions[${index}][id]`, item.id);
    formattedData.append(`subscriptions[${index}][package_id]`, item.value);
    formattedData.append(`subscriptions[${index}][start_date]`, item.date_range );
    formattedData.append(`subscriptions[${index}][end_date]`, item.date_range2 );
    formattedData.append(`subscriptions[${index}][price]`, index === 0 ? "99.99" : "49.99" );
    formattedData.append(`subscriptions[${index}][number_of_transactions]`, item.transactions);
    formattedData.append(`subscriptions[${index}][data_mb]`, item.mbs);
    formattedData.append(`subscriptions[${index}][total_users]`, item.total_users);
    formattedData.append(`subscriptions[${index}][login_users]`, item.total_users_loggin);
    formattedData.append(`subscriptions[${index}][transaction_id]`, '');
  });

    setBtnLoading(true);
    try {
      const response = await systemAdvanceService.updateSystemAdvanceSettings(formattedData);
      if (response.success) {
        notification.success({
          message: 'Settings has been Updated',
          // description: response.message,
          description: 'Settings has been Updated',
        });
      getSystemSettings();

      }
    } catch (error) {
      console.log(error);
      setBtnLoading(false);
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setBtnLoading(false);
    }
      setBtnLoading(false);
  };


  const addField = () => {
    const newField = {
      id: fields.length,
      date_range: [],
      transactions: 0,
      mbs: 0,
      total_users: 0,
      total_users_loggin: 0,
      package: null,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id, db_id) => {

    if(db_id !== undefined){
      Modal.confirm({
        title: "Confirm Deletion",
        content: `Are you sure you want to delete the subscription ID: ${db_id}?`,
        onOk: async () => {
          setLoading(true);
          try {
            const response = await systemAdvanceService.deleteSubscription(db_id);
            if (response.success) {
              notification.success({
                message: "Subscription Deleted",
                description: response.message,
              });
              getSystemSettings();
              setFields(fields.filter((field) => field.id !== id));

            }
          } catch (error) {
            notification.error({
              message: "Error",
              description: error.response.data.message,
            });
          } finally {
            setLoading(false);
          }
        },
      });
    }else{
      setFields(fields.filter((field) => field.id !== id));
    }
  };

  return (
    <DefaultLayout>

      <Form form={form} onFinish={onFinish} layout="vertical">
       <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UserOutlined />}
            title="Advance Settings"
            right={
                <div className="text-right" style={{ marginRight: '30px'}}>
            <Form.Item>
              <Button
                loading={btnLoading}
                size="large"
                type="primary"
                htmlType="submit"
              >
                Save Settings
              </Button>
            </Form.Item>
          </div>
      }
          />
        </Col>
      </Row>

      <Card title="Subscription Detail" className="pt-10 pl-10">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            {fields.map((field, index) => (
              <Row gutter={[12, 12]} key={field.id} style={{ display: "flex", marginBottom: 34 }}>

                <Col span={0}>
                  <Form.Item name={["subscriptions", index, "idd"]} >
                    <Input type="hidden" />
                  </Form.Item>
                </Col>

                <Col span={5}>
                  <Form.Item
                    name={["subscriptions", index, "date_range"]}
                    label="Date Range"
                    rules={[{ required: true, message: "Please select a date range" }]}
                  >
                    <DatePicker.RangePicker size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item
                    name={["subscriptions", index, "transactions"]}
                    label="Transactions"
                    rules={[{ required: true, message: "Please enter transactions" }]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item
                    name={["subscriptions", index, "mbs"]}
                    label="Data (In MBs)"
                    rules={[{ required: true, message: "Please enter data in MBs" }]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item
                    name={["subscriptions", index, "total_users"]}
                    label="Total Users"
                    rules={[{ required: true, message: "Please enter total users" }]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item
                    name={["subscriptions", index, "total_users_loggin"]}
                    label="Login Users"
                    rules={[{ required: true, message: "Please enter login users" }]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item
                    name={["subscriptions", index, "package"]}
                    label="Package"
                    // rules={[{ required: true, message: "Please select a package" }]}
                  >
                    <Select size="large" style={{ width: "100%" }} placeholder="Select Package">
                      <Select.Option value="package one">Package One</Select.Option>
                      <Select.Option value="package two">Package Two</Select.Option>
                      <Select.Option value="package three">Package Three</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Tag style={{ marginTop: "25px", marginLeft: "25px" }}>
                    <b>Remaining: {field.total_users - field.total_users_loggin}</b>
                  </Tag>
                  {index !== 0 && (
                    <Button
                      style={{ marginTop: "0px" }}
                      size="large"
                      onClick={() => removeField(field.id, field.idd)}
                    >
                      <DeleteOutlined />
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={addField} icon={<PlusOutlined />}>
              Add More
            </Button>
          </Col>
        </Row>
      </Card>
    </Form>
      {/*</Card>*/}
    </DefaultLayout>
  );
};

export default Settings;
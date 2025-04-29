import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Card,
  notification,
  Skeleton,
  InputNumber,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import crfSetting from '../../services/crfSetting';
import Header from '../../components/header';
import DefaultLayout from './../../components/layout/DefaultLayout';
import './index.css';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState(null);

  const currencies = [
    'USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','SEK','NZD','NOK','SGD','KRW','TRY','MXN','INR','BRL','ZAR','HKD','RUB',
    'DKK','PLN','THB','IDR','HUF','CZK','ILS','CLP','PHP','AED','COP','MYR','RON','SAR','HRK','BGN','EGP','QAR','VND','ARS','NGN',
    'PKR','UAH','KWD','BDT','IQD','MAD','OMR','LKR','TWD',
  ];
  
  const getCrfSettings = async () => {
    setLoading(true);
    try {
      const response = await crfSetting.getCrfSettings();
      console.log('response')
      console.log(response)
      console.log('response')
      const crfSettingsData = response.data[0];
      setData(crfSettingsData);
      setLoading(false);
  
      form.setFieldsValue({
        capital_max_amount: crfSettingsData?.data[0]?.capital_max_amount,
        revenue_max_amount: crfSettingsData?.data[0]?.revenue_max_amount,
        crf_currency: crfSettingsData?.data[0]?.crf_currency,
      });
      
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: error.response,
      });
    }
  };

  useEffect(() => {
    getCrfSettings();
  }, []);

  const onFinish = async (values) => {
    //console.log(values)
    
  const payload = {
    type: "crf",
    data: [
      {
        capital_max_amount: values.capital_max_amount,
        revenue_max_amount: values.revenue_max_amount,
        crf_currency: values.crf_currency,
      },
    ],
  };

    setBtnLoading(true);
    try {
      const response = await crfSetting.updateCrfSettings(payload);
      if (response.success) {
        notification.success({
          message: 'Crf Settings has been Updated',
          description: response.message,
        });
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
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UserOutlined />}
            title="Crf Settings"
            right={<></>}
          />
        </Col>
      </Row>
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
          className="mt-20"
        >


  <Card title="Amount Limits" className="mb-10">
    <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
        <Row gutter={[12, 12]}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Capital Maximum Amount"
              name="capital_max_amount"
              rules={[
                {
                  required: true,
                  message: 'Please enter the capital maximum amount!',
                },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: '100%' }}
                placeholder="Enter capital max amount"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Revenue Maximum Amount"
              name="revenue_max_amount"
              rules={[
                {
                  required: true,
                  message: 'Please enter the revenue maximum amount!',
                },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: '100%' }}
                placeholder="Enter revenue max amount"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              name="crf_currency"
              label="Currency"
              rules={[
                {
                  required: true,
                  message: 'Please select the currency',
                },
              ]}
            >
              <Select
                placeholder="Select Currency"
                size="large"
              >
                {currencies.map((currency) => (
                  <Option key={currency} value={currency}>
                    {currency}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Skeleton>
  </Card>

<Row>
  <Col lg={24} md={24} sm={24} xs={24}>
        <div className="text-right">
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
      </Col>
  </Row>

        </Form>
      </Card>
    </DefaultLayout>
  );
};

export default Settings;

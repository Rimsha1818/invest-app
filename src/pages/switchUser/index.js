import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userSlice';
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
import UserComponent from "./../../components/user/index";
import impersonate from '../../services/impersonate';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    dispatch(loginStart());
    setBtnLoading(true);
    try {
      const response = await impersonate.impersonateUser(values);
      if (response.impersonated_user){
        // response.impersonated_user.token = currentUser.token;
        console.log(response)
        localStorage.setItem('token', response.impersonated_user?.token);
        console.log(currentUser.token)
        console.log('response.impersonated_user.token', response.impersonated_user.token)
        // response.impersonated_user.token = response.impersonated_user.token || currentUser?.token;

        dispatch(loginSuccess(response.impersonated_user));
         notification.success({
          message: 'Account Switched',
          description: response.message,
        });
        navigate('/dashboard');

      }
    } catch (error) {
      dispatch(loginFailure());
      console.log(error);
      setBtnLoading(false);
      notification.error({
        message: 'Error',
        description: error,
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
            title="Switch User"
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


  <Card title="Switch account" className="mb-10">
    <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
        <Row gutter={[12, 12]}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              name='user_id'
              label={`Select User`}
              rules={[{ required: true, message: 'Please select User' }]}
            >
            <UserComponent />
            </Form.Item>
          </Col>
          <Col lg={8} md={8} sm={8} xs={8} className="mt-20">
            <Form.Item>
              <Button
                style={{width:'250'}}
                loading={btnLoading}
                size="large"
                type="primary"
                htmlType="submit"
              >
                Switch Account
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Skeleton>
  </Card>

        </Form>
      </Card>
    </DefaultLayout>
  );
};

export default Settings;

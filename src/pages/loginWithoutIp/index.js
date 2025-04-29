import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Layout, Divider, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userSlice';
import auth from '../../services/authWithoutIp';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthSideContent from './../../components/layout/AuthSideContent';
import './index.css';

const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);




  const handleFormSubmit = async (values) => {
    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await auth.login(values);
      if (response) {
        setLoading(false);
        const token = response.data.token;
        localStorage.setItem('token', token);
        const previousUrl = location?.state?.prevUrl;
        const dashboardUrl = '/dashboard'
        navigate(previousUrl ? previousUrl : dashboardUrl );
        dispatch(loginSuccess(response.data));
        message.success('Login successful');
      }
    } catch (error) {
      setLoading(false);
      dispatch(loginFailure());
      message.error('Wrong credentials. Please check your email and password.');
    }
  };

  return (
    <AuthLayout sideContent={<AuthSideContent />}>
      <Content
        style={{
          padding: '200px 30px 30px',
          maxWidth: '440px',
          margin: '0 auto',
          height: '100vh',
        }}
      >
    
        <h1>Sign in</h1>
        <Divider />
        <Form
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item name="email" rules={[{ required: true }]}>
            <Input size="large" placeholder="Email Address" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input type="password" size="large" placeholder="Password" />
          </Form.Item>

          <Button
            loading={loading}
            size="large"
            className="btn-blue login-form-button"
            htmlType="submit"
            type="primary"
            block
          >
            Login
          </Button>
        </Form>
      </Content>
    </AuthLayout>
  );
};

export default Login;

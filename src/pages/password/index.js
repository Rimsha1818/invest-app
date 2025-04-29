import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Row, Col, message, Card, notification} from 'antd';
import { LockFilled } from '@ant-design/icons'; 
import authService from '../../services/auth';
import DefaultLayout from './../../components/layout/DefaultLayout';
import Header from '../../components/header';
import './index.css';

const Password = () => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); 
  const { currentUser } = useSelector((state) => state.user);

  const onFinish = async (values) => {
    try {
      
      setLoading(true);
      
      const response = await authService.updatePassword(currentUser.user_id, values);
      
      if (response.success) {
        setLoading(false);
        notification.success({
          message: 'Password Updated',
          description: response.message,
        });
      }
    }
    catch (error) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
      <Col span={24}>
      <Header
  icon={<LockFilled />}
  title="Change Password"
/>
                </Col>
      </Row>

      <Card style={{height: '100vh'}}>
        <Form form={form} onFinish={onFinish} layout="vertical" scrollToFirstError className="mt-20">
              <Card title="Password Section" className="mb-10">
                <Row gutter={[12, 12]}>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please enter a password' },
                        { min: 8, message: 'Password must be at least 8 characters' },
                      ]}
                    >
                      <Input.Password size="large" />
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="password_confirmation"
                      label="Confirm Password"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject('Passwords do not match');
                          },
                        }),
                      ]}
                    >
                      <Input.Password size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>                  Update Password
                  </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </Card>
    </DefaultLayout>
  );
};

export default Password;

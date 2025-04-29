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
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import systemService from '../../services/system';
import Header from '../../components/header';
import DefaultLayout from './../../components/layout/DefaultLayout';
import './index.css';

  const { Option } = Select;
const Settings = () => {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedExtensions, setSelectedExtensions] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const staticAllowedExtensionsOptions = [
    'jpg',
    'gif',
    'jpeg',
    'png',
    'doc',
    'docx',
    'xls',
    'txt',
    'xlsx',
    'ppt',
    'pptx',
    'csv',
    'pdf',
    'pst',
    'ost',
    'eml',
    'oft',
    'dat',
    'vcf',
    'msg',
    'svg',

    
  ];

    const [timezones, setTimezones] = useState([]);

  // Fetch timezones on mount
  useEffect(() => {
    // List of all timezones
    const allTimezones = Intl.supportedValuesOf("timeZone");
    setTimezones(allTimezones);
  }, []);

  const [data, setData] = useState(null);

  const validateEmailFormat = (rule, value, callback) => {
    if (!value) {
      callback('Please enter email username!');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      callback('Please enter a valid email username!');
    } else {
      callback();
    }
  };

  const getSystemSettings = async () => {
    setLoading(true);
    try {
      const response = await systemService.getSystemSettings();
      console.log('response')
      console.log(response)
      console.log('response')
      const systemSettings = response[0];
  
      let allowedExtensionsArray = [];
      if (systemSettings.allowed_extensions) {
        try {
          allowedExtensionsArray = JSON.parse(systemSettings.allowed_extensions);
        } catch (jsonError) {
          console.log(jsonError);
          allowedExtensionsArray = [];
        }
      }
  
      setData(systemSettings);
      setLoading(false);
  
      form.setFieldsValue({
        email_transport: systemSettings.email_transport,
        email_host: systemSettings.email_host,
        email_username: systemSettings.email_username,
        email_password: systemSettings.email_password,
        email_port: systemSettings.email_port,
        email_encryption: systemSettings.email_encryption,
        max_upload_size: systemSettings.max_upload_size,
        allowed_extensions: allowedExtensionsArray,
        timezone: systemSettings.timezone,
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
    getSystemSettings();
  }, []);

  const onFinish = async (values) => {
    //console.log(values)
    setBtnLoading(true);
    try {
      const response = await systemService.updateSystemSettings(values);
      if (response.success) {
        notification.success({
          message: 'Settings has been Updated',
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
            title="System Settings"
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
          <Card title="Media settings" className="mb-10">
            <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
              <Row gutter={[12, 12]}>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label="Max Upload Size in KB"
                    name="max_upload_size"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter max upload size!',
                      },
                    ]}
                  >
                    <Input size="large" type="number" />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label="Allowed Extensions"
                    name="allowed_extensions"
                    rules={[
                      {
                        required: true,
                        message: 'Please select allowed extensions!',
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      showSearch={true}
                      optionFilterProp="children"
                      placeholder="Select or enter allowed extensions"
                    >
                      {staticAllowedExtensionsOptions.map((extension) => (
                        <Select.Option key={extension} value={extension}>
                          {extension}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              
             
              </Row>
            </Skeleton>
          </Card>

          <Card title="Email settings" className="mb-10">
  <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
    <Row gutter={[12, 12]}>
      <Col lg={8} md={12} sm={24} xs={24}>
        <Form.Item
          label="Email Transport"
          name="email_transport"
          rules={[
            {
              required: true,
              message: 'Please enter email transport!',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
      </Col>
    
      <Col lg={8} md={12} sm={24} xs={24}>
        <Form.Item
          label="Email Host"
          name="email_host"
          rules={[
            {
              required: true,
              message: 'Please enter email host!',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
      </Col>

      <Col lg={8} md={12} sm={24} xs={24}>
        <Form.Item
          label="Email Port"
          name="email_port"
          rules={[
            {
              required: true,
              message: 'Please enter email port!',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
      </Col>

      <Col lg={8} md={12} sm={24} xs={24}>
        <Form.Item
          label="Email Encryption"
          name="email_encryption"
          rules={[
            {
              required: true,
              message: 'Please enter email encryption!',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
      </Col>
      
      <Col lg={8} md={12} sm={24} xs={24}>
        <Form.Item
          label="Email Username"
          name="email_username"
          rules={[
            {
              required: true,
              message: 'Please enter email username!',
            }
          ]}
        >
          <Input size="large"  />
        </Form.Item>
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <Form.Item
          label="Email Password"
          name="email_password"
          rules={[
            {
              required: true,
              message: 'Please enter email password!',
            },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
      </Col>
      
      
     
    </Row>
  </Skeleton>





</Card>


<Card title="Other settings" className="mb-10">
  <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
      <Row gutter={[12, 12]}>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[
              {
                required: true,
                message: 'Please select a timezone!',
              },
            ]}
          >
            <Select
              size="large"
              showSearch
              placeholder="Select a timezone"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {timezones.map((tz) => (
                <Option key={tz} value={tz}>
                  {tz}
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

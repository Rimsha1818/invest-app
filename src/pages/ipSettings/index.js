import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Select, Row, Col, Card, notification, Skeleton, Badge, DatePicker, InputNumber, Tag, Modal, Switch,} from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ipService from '../../services/ipSetting';
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

    const [settingsEnabled, setSettingsEnabled] = useState(false);
  const [isAllowedIp, setIsAllowedIp] = useState(true);


  const getSystemSettings = async () => {
    setLoading(true);
    try {
      const response = await ipService.getIPSettings();
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
        ip_address: item.ip_address,
        description: item.description,
      }));

      setFields(transformedFields);

      // Set initial form values
      form.setFieldsValue({
        ip_restrictions: transformedFields.map((field) => ({
          idd: field.idd,
          ip_address: field.ip_address,
          description: field.description,
        })),
      });
    }
  }, [data, form]);

  const onFinish = async (values) => {

  let ipType = 'allow';
  if(isAllowedIp === false){
    ipType = 'restrict';
  }
  
  console.log('values')
  console.log(values)
  console.log(ipType)
  console.log('values')

  const ip_restrictions = values.ip_restrictions.map((item, index) => ({
    ['id']: item.idd !== undefined ? item.idd : '',
    ['type']: item.package || '',
    ['ip_address']: item.ip_address || '',
    ['description']: item.description || '',
  }));

  const formattedData = new FormData();
  ip_restrictions.forEach((item, index) => {
    formattedData.append(`ip_restrictions[${index}][id]`, item.id);
    formattedData.append(`ip_restrictions[${index}][type]`, ipType);
    formattedData.append(`ip_restrictions[${index}][ip_address]`, item.ip_address );
    formattedData.append(`ip_restrictions[${index}][description]`, item.description );
  });

    setBtnLoading(true);
    try {
      const response = await ipService.updateIPSettings(formattedData);
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
            const response = await ipService.deleteIp(db_id);
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


    const handleToggle = (checked) => {
    setSettingsEnabled(checked);
  };

  const handleIpTypeToggle = (checked) => {
    setIsAllowedIp(checked);
  };

  return (
    <DefaultLayout>

      <Form form={form} onFinish={onFinish} layout="vertical">
       <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UserOutlined />}
            title="IP Settings"
            right={
                <div className="text-right" style={{ marginRight: '30px'}}>

            <Form.Item>
              <Button
                loading={btnLoading}
                size="large"
                type="primary"
                htmlType="submit"
              >
                Save / Update
              </Button>
            </Form.Item>
          </div>
      }
          />
        </Col>
      </Row>


      <Card title="Manage IPs" className="pt-10 pl-10">

      <Row gutter={[12, 12]} style={{ marginBottom: '25px' }}>
        <Col span={4} style={{ marginBottom: '25px' }}>
          <Switch
            checked={isAllowedIp}
            onChange={handleIpTypeToggle}
            checkedChildren="Allowed"
            unCheckedChildren="Blocked"
          />
        </Col>
      </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
          {fields.map((field, index) => (
              <Row gutter={[12, 12]} key={field.id} style={{ display: "flex", marginBottom: 34 }}>

                <Col span={0}>
                  <Form.Item name={["ip_restrictions", index, "idd"]} >
                    <Input type="hidden" />
                  </Form.Item>
                </Col>

                <Col span={5}>
                <Form.Item
                    label="IP"
                    name={['ip_restrictions', index, 'ip_address']}
                    rules={[{ required: true, message: 'Please enter an IP Address' }]}
                  >
                    <Input
                      placeholder="e.g., 192.168.0.1"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    label="Reason"
                    name={['ip_restrictions', index, 'description']}
                    // rules={[{ required: true, message: 'Please enter a Reason' }]}
                  >
                    <Input
                      placeholder="Attacker"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                
                <Col span={8}>
                
                  {index !== 0 && (
                    <Button
                      style={{ marginTop: "24px" }}
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
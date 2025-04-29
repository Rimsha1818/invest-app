import React from 'react';
import { Form, Select, Button, Input, Row, Col, Card, Badge } from 'antd';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import {
  PlayCircleOutlined, 
} from '@ant-design/icons';
const { Option } = Select;

const FormInitiator = () => {
  const onFinish = (values) => {
  };

  return (
    <DefaultLayout>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<PlayCircleOutlined/>}
            title="Form Initiator"
            right={() => {<></>}}
          />
        </Col>
      </Row>

      <Badge.Ribbon text="Form conditional Initiator">
      <Card>
      <Form
      name="initiator-form"
      onFinish={onFinish}
      layout="vertical"
    >

      <Row gutter={[24, 24]}>
        <Col span={12}>
        
      <Form.Item
        name="initiatorFieldOne"
        label="Initiator Field One"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select showSearch={true} optionFilterProp="children" size="large">
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item
        name="initiatorFieldTwo"
        label="Initiator Field Two"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select showSearch={true} optionFilterProp="children" size="large">
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </Form.Item>

        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={12}>
        <Form.Item
        name="initiatorFieldThree"
        label="Initiator Field Three"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select showSearch={true} optionFilterProp="children" size="large">
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item
        name="initiatorFieldFour"
        label="Initiator Field Four"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select showSearch={true} optionFilterProp="children" size="large">
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </Form.Item>
        </Col>
      </Row>

     

      <Row gutter={[24, 24]}>
        <Col span={12}>
        <Form.Item
        name="initiatorFieldFive"
        label="Initiator Field Five"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select showSearch={true} optionFilterProp="children" size="large">
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option>
        </Select>
      </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item
        name="feedback"
        label="Feedback"
        rules={[{ required: true, message: 'Please enter your feedback' }]}
      >
        <Input size='large' />
      </Form.Item>

      
        </Col>
      </Row>

      <Row>
        <Col span={24}>
        <Form.Item>
        <Button type="primary" htmlType="submit">          Submit
        </Button>
      </Form.Item>
        </Col>
      </Row>
      
      </Form>
      </Card>
      </Badge.Ribbon>
      

      

      
    </DefaultLayout>
  );
};

export default FormInitiator;

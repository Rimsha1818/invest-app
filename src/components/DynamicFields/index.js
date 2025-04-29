import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, Card, Badge } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ConditionSelect from '../workflowConditions';

const { Option } = Select;

const DynamicFields = ({
  fields,
  setFields,
  approvers,
  subscribers,
  conditions,
  handleApproverChange,
  handleSubscriberChange,
  getFilteredApprovers,
  getFilteredSubscribers,
  selectedForm,
  add_manage_wf
}) => {
  const addField = () => {
    const newField = {
      id: fields.length,
      approver_id: '',
      subscriber_id: '',
      approval_condition: '',
      sequence_no: '',
      editable: '',
    };
    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    if (fields.length === 1) {
      return;
    }
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
  };

// console.log('inside the component conditions', conditions)
  return (
    <Row>
      <Col span={24}>
        {fields.map((field, index) => (
          <Card size='small' key={field.id} title={<span><Badge color='#2d77fa' count={index + 1} /> Approver & Subscriber</span>} style={{marginBottom: '10px'}}>
            <Row gutter={[12, 12]} key={field.id} style={{ display: 'flex', marginBottom: 34 }}>
              <Col lg={4} md={12} sm={12} xs={12}>
                <Form.Item
                  name={['workflowSubscribersApprovers', field.id, 'approver_id']}
                  label="Approver"
                  rules={[
                    {
                      required: true,
                      message: 'Please select an approver!',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="large"
                    allowClear
                    onChange={(value) => handleApproverChange(value, field.id)}
                  >
                    {getFilteredApprovers(field.id).map((approver) => (
                      <Option key={approver.id} value={approver.id}>
                        {approver.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={4} md={12} sm={12} xs={12}>
                <Form.Item
                  name={['workflowSubscribersApprovers', field.id, 'subscriber_id']}
                  label="Subscriber"
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="large"
                    allowClear
                    onChange={(value) => handleSubscriberChange(value, field.id)}
                  >
                    {getFilteredSubscribers(field.id).map((subscriber) => (
                      <Option key={subscriber.id} value={subscriber.id}>
                        {subscriber.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* {(selectedForm == 2 || selectedForm == 4 || selectedForm == 1) && */}
              <Col lg={7} md={12} sm={12} xs={12}>
                <Form.Item 
                  name={['workflowSubscribersApprovers', field.id, 'approval_condition']}
                  label="Approval Condition"
                >
                   <ConditionSelect
                   selectedForm={selectedForm}
                   value={field.approval_condition}
                   onChange={(value) => {
                     const updatedFields = fields.map(f => 
                       f.id === field.id ? { ...f, approval_condition: value } : f
                     );
                     setFields(updatedFields);
                   }}
                   add_manage_wf = {add_manage_wf}
                 />          
                </Form.Item>
              </Col>
              {/* }  */}

              <Col lg={3} md={12} sm={12} xs={12}>

                <Form.Item
                  name={['workflowSubscribersApprovers', field.id, 'sequence_no']}
                  label="Sequence No"
                  initialValue={index + 1}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a valid number!',
                      pattern: /^[0-9]+$/,
                    },
                  ]}
                >
                  <Input 
                    size="large" 
                    type="number" // Ensures only numeric input
                    placeholder="Please type numeric value"
                    onChange={(e) => {
                      const updatedFields = fields.map(f =>
                        f.id === field.id ? { ...f, sequence_no: Number(e.target.value) } : f
                      );
                      setFields(updatedFields);
                    }}
                  />
                </Form.Item>
                
               {/* <Form.Item 
                  name={['workflowSubscribersApprovers', field.id, 'sequence_no']}
                  label="Sequence No"
                  initialValue={index + 1}
                >
                  <Input size="large" placeholder='Please type numeric value' />
                </Form.Item>*/}
              </Col>
              <Col lg={4} md={12} sm={12} xs={12}>
                <Form.Item
                  name={['workflowSubscribersApprovers', field.id, 'editable']}
                  label="Editable"
                  rules={[
                    {
                      required: true,
                      message: 'Please select Editable Status',
                    },
                  ]}
                >
                  <Select showSearch={true} optionFilterProp="children" size="large">
                    <Option value={1}>Yes</Option>
                    <Option value={0}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button style={{ marginTop: '27px' }} size="large" onClick={() => removeField(field.id)}>
                  <MinusOutlined />
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
        <Form.Item className="textRight" style={{ marginRight: '10px' }}>
          <Button type="dashed" onClick={addField} icon={<PlusOutlined />}>
            Add Dynamic Fields
          </Button>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DynamicFields;

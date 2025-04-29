import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Card,
  DatePicker,
  Table,
  notification,
} from 'antd';
import './index.css';
import DefaultLayout from '../../components/layout/DefaultLayout';
import MobileRequisitionService from '../../services/mobileRequisition';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import UserComponent from '../../components/user';
import MakeComponent from '../../components/make';


const { TextArea } = Input;

export default function MobileRequisitionForm() {

  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [isDraft, setIsDraft] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getMrDetails(id);
    }
  }, [id]);

  const getMrDetails = async (id) => {
    setLoading(true);
    try {
      const record = await MobileRequisitionService.getMRDetails(id);
      setLoading(false)
      setEdit(record);
      form.setFieldsValue({
        request_title: record.request_title,
        request_for_user_id: record.request_for_user.id,
        model: record.model,
        make: record.make.id,
        imei: record.imei,
        remarks: record.remarks,
        mobile_number: record.mobile_number,
        issue_date: moment(record.issue_date, 'YYYY-MM-DD'),
        recieve_date: moment(record.recieve_date, 'YYYY-MM-DD'),
      })

    } catch (error) {
      setLoading(false)
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false)
    }
  };

  const onFinish = async (values) => {

    const fullMobileNumber = `+92${values.mobile_number}`;
    values.mobile_number = fullMobileNumber;

    values.issue_date = moment(values.issue_date).format('YYYY-MM-DD');
    values.recieve_date = moment(values.recieve_date).format('YYYY-MM-DD');
    setLoading(true);
    values.save_as_draft = isDraft;
    console.log('FInal values ', values);
    try {
      if (edit) {
        const response = await MobileRequisitionService.update(edit.id, values);
        if (response.success === true) {
          setEdit(null);
          form.resetFields();
          notification.success({
            message: 'Updated',
            description: response.message,
          });
          navigate('/mobile-requisition');
        }
      } else {
        const response = await MobileRequisitionService.post(values);
        if (response.data) {
          setEdit(null);
          form.resetFields();
          notification.success({
            message: 'Added',
            description: response.message,
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Eligibility Criteria',
      dataIndex: 'eligibilityCriteria',
      key: 'eligibilityCriteria',
    },
    {
      title: 'Handset Price Limit',
      dataIndex: 'handsetPriceLimit',
      key: 'handsetPriceLimit',
    },
    {
      title: 'Monthly Line Rent Limit',
      dataIndex: 'monthlyLineRentLimit',
      key: 'monthlyLineRentLimit',
    },
  ];

  const tableData = [
    {
      key: '1',
      eligibilityCriteria: 'G-2 & Above',
      handsetPriceLimit: '$750',
      monthlyLineRentLimit: '5,000',
    },
    {
      key: '2',
      eligibilityCriteria: 'G-3 to G-6',
      handsetPriceLimit: '$300',
      monthlyLineRentLimit: '5,000',
    },
    {
      key: '3',
      eligibilityCriteria: 'G-7 & below (Job Requirement)',
      handsetPriceLimit: (
        <div>
          $150
          <br />
          $50
        </div>
      ),
      monthlyLineRentLimit: '3,000',
    },
  ];

  return (
    <DefaultLayout>
      <Card style={{ minHeight: '100vh' }}>
        <Form
          autoComplete="off"
          layout="vertical"
          scrollToFirstError
          className="mt-20"
          form={form}
          onFinish={onFinish}
        >
          <Card size="small" className="mb-10" title="Personal Information">
            <Row gutter={[12, 12]}>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Form.Item
                  name="request_for_user_id"
                  label="Employee Name"
                  showSearch={true}
                  allowClear
                  rules={[
                    { required: true, message: 'Please select employee' },
                  ]}
                >
                  <UserComponent employee_no={true} multiselect={false} forMR={true} />
                </Form.Item>
              </Col>

              {/* <Col lg={12} md={12} sm={12} xs={12}>
                <Form.Item
                  name="employee_code"
                  label="Employee Code"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the Employee Code',
                    },
                  ]}
                >
                  <Input size="large" placeholder="Employee Code" />
                </Form.Item>
              </Col> */}
            </Row>

            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  name="issue_date"
                  label="Issue Date"
                >
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Select Issue Date"
                  />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  name="recieve_date"
                  label="Receive Date"
                >
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Select Receive Date"
                  />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                  name="make"
                  label="Make"
                  // initialValue={1}
                  rules={[
                    // { required: true, message: 'Please select a Department' },
                  ]}>
                
                    <MakeComponent all={true} />
                </Form.Item>

               
              </Col>

              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  name="model"
                  label="Model#"
                >
                  <Input size="large" placeholder="Enter Model#" />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
  name="imei"
  label="Mobile IMEI#"
>
  <InputNumber 
    size="large" 
    placeholder="Enter Mobile IMEI#" 
    style={{ width: '100%' }}  // Make it full width like Input
    controls={false}  // Disable the increment/decrement buttons
  />
</Form.Item>
                
              </Col>

              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  name="mobile_number"
                  label="Mobile#"
                  rules={[{ required: true, message: 'Please enter mobile number!' }]} 
                >
                  <Input.Group compact>
                    <Input 
                      style={{ width: '100px', textAlign: 'center' }} 
                      value="+92" 
                        size="large" 

                      readOnly 
                    />
                    <Form.Item
                      name="mobile_number" 
                    >
                      <Input 
                        style={{ width: '260px'}} 
                        size="large" 
                        placeholder="Enter Mobile#" 
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>

              <Col lg={24} md={24} sm={24} xs={24}>
                <Form.Item name="remarks" label="Remarks" rules={[
                  {
                    required: true,
                    message: 'Please enter the Remarks',
                  },
                ]}>
                  <TextArea size="large" placeholder="Enter Remarks" rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="mt-24"
          >
            <Button
              type="primary"
              block
              disabled={loading}
              loading={loading}
              className="btn-blue mr-20"
              onClick={() => {
                setIsDraft('false');
                form.submit();
              }}
            >
              Save & Publish
            </Button>

            <Button
              loading={loading}
              disabled={loading}
              type="primary"
              onClick={() => {
                setIsDraft('true');
                form.submit();
              }}
            >
              Save Draft
            </Button>
          </div>
        </Form>

        <p className="mt-40 mb-10">
          <strong>Note:</strong>
        </p>
        <Table
          className="mb-80"
          columns={columns}
          dataSource={tableData}
          pagination={false}
        />
      </Card>
    </DefaultLayout>
  );
}

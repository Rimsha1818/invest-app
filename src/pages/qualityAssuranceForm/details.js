import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Card, notification, Tag, Skeleton, Spin, Button, Typography, Select} from 'antd';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { FormOutlined } from '@ant-design/icons';
import qaService from '../../services/qualityAssurance';
import approvalService from '../../services/approver';

import CommentSystem from '../../components/comment';
import CreatedByComponent from '../../components/commonDetails/createdBy';
import ApproversComponent from '../../components/commonDetails/approvers';
import ApproveDisapproveComponent from '../../components/commonDetails/approveDisapprove/index';
import TaskStatus from '../../components/commonDetails/taskStatus';
import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import { useSelector } from 'react-redux';



const QualityAssuranceDetails = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [currentFormId] = useState(1);
  const [assignedUserId, setAssignedUserId] = useState(null);

  const [formId] = useState(1);
  const { currentUser } = useSelector((state) => state.user);
  


  const handleRedirectForm = (data) => {
    var path = `/scrf/details/${data}`;
     console.log(path); // Example Output: /scrf/details/5
     navigate(path); 
  };

  useEffect(() => {
    getQaDetails();
  }, []);

  const getQaDetails = async () => {
    setLoading(true);
    await qaService.getQaDetails(id).then((response) => {
      console.log(response);
      setData(response);
      setLoading(false);
    });
  };

  const handleSubmit = async (values, isParallel) => {
    setLoading(true);
    const formattedValues = {
      status,
      approved_disapproved: false,
      form_id: currentFormId,
      key: parseInt(id),
      reason: values.message,
      ...(isParallel && { assigned_user_id: assignedUserId }),
    };

    const serviceMethod = isParallel
      ? approvalService.updateParallelStatus
      : approvalService.updateStatus;

    try {
      const response = await serviceMethod(formattedValues);
      if (response.success) {
        notification.success({
          message: 'Status',
          description: response.message,
        });
        form.resetFields();
        getQaDetails(id);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(data);
  const Isadmin = currentUser.roles.includes("admin");

  return (
    <DefaultLayout>
    
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="Quality Assurance Details" />
        </Col>
      </Row>

      <Card style={{ minHeight: '100vh' }}>
      {data && data.form_name === "SCRF" && (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Button 
              type="primary" 
              className="mb-10 float-right" 
              onClick={() => handleRedirectForm(data.related_record.id)}
            >
              View Form
            </Button>
          </Col>
        </Row>
      )}

        <Row gutter={[24, 24]}>
          <Col lg={5} md={5} sm={24} xs={24}>
            <CreatedByComponent data={data} />
              {data && (data.status === "Pending" || data.status === "Approved") && Isadmin === true && (
                <AddApproversComponent data={data && data} formId = {formId} />
              )}
            <ApproversComponent approvers={data && data.approvers} />
          </Col>
          <Col lg={19} md={19} sm={24} xs={24}>
            <div>
              {data?.approved_disapproved == true && (
                <div
                  style={{
                    position: 'sticky',
                    top: 1,
                    zIndex: 999,
                    background: '#fff',
                    padding: '5px',
                    borderRadius: '4px'
                  }}>
                  <Spin spinning={loading}>
                    <b>Approval Request</b>
                    <ApproveDisapproveComponent
                      form={form}
                      handleStatus={(values) => handleSubmit(values, false)}
                      loading={loading}
                      setStatus={setStatus}
                    />
                  </Spin>
                </div>
              )}

              {data?.parallel_approved_disapproved == true && (
                <div
                  style={{
                    position: 'sticky',
                    top: data?.approved_disapproved ? '150px' : '1px', // Adjust the top value as needed 
                    zIndex: 999,
                    background: '#fff', // Add a background color
                    padding: '5px', // Add padding for better visual separation
                    borderRadius: '4px' // Optional: Add rounded corners
                  }}>
                  <Spin spinning={loading}>
                    <b>Parallel Approval Request</b>
                    <ApproveDisapproveComponent
                      form={form}
                      handleStatus={(values) => handleSubmit(values, true)}
                      loading={loading}
                      setStatus={setStatus}
                      parallel={true}
                      parallelUsers={
                        data && data.parallel_approved_disapproved_users
                      }
                      setAssignedUserId={setAssignedUserId}
                      reloadData={getQaDetails}
                    />
                  </Spin>
                </div>
              )}

              {data?.assigned_task_to_me === true && (
                <div
                  style={{
                    position: 'sticky',
                    top: '1px',
                    zIndex: 999,
                    background: '#fff', // Add a background color
                    padding: '5px', // Add padding for better visual separation
                    borderRadius: '4px' // Optional: Add rounded corners
                  }}>
                  <TaskStatus data={data} reloadData={getQaDetails} />
                </div>
              )}

              <Skeleton active loading={loading}>
                {data && data.created_at && (
                  <Card title="Quality Assurance Details" className="mb-10">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10">Assurance (QA) Tester</p>
                        <Tag style={{ width: '100%'}}>{data.qa_tester.name}</Tag>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={3} xl={6}>
                        <p className="fs-12 mb-10">Status</p>
                        <Tag style={{ width: '100%'}}>{data.status}</Tag>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={3} xl={3}>
                        <p className="fs-12 mb-10">Submitted at</p>
                        <Tag>{data.status_at}</Tag>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={12} xl={9}>
                        <p className="fs-12 mb-10">Feedback</p>
                        <Tag>{data.feedback}</Tag>
                      </Col>

                      
                    </Row>
                  </Card>
                )}
              </Skeleton>

              <Skeleton active loading={loading}>
                {data && data.request_title && (
                  <>
                    <Card title="Basic Information" className="mb-10">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                          <p className="fs-12 mb-10">Sequence No</p>
                          <Tag style={{ width: '100%'}}>{data.sequence_no}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={9} xl={9}>
                          <p className="fs-12 mb-10">Request Title</p>
                          <Tag style={{ width: '100%'}}>{data.request_title}</Tag>
                        </Col>
                        
                        <Col xs={24} sm={12} md={8} lg={7} xl={7}>
                          <p className="fs-12 mb-10">Task Status</p>
                          <Tag style={{ width: '100%'}}>{data.related_record?.task_status_name?.name}</Tag>
                        </Col>
                      </Row>
                    </Card>
                    {/* 
                    <Card title="Assigned To Users" className="mb-10">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          {data.assigned_to_users.map((user) => (
                            <Tag key={user.id}>{user.name}</Tag>
                          ))}
                        </Col>
                      </Row>
                    </Card> */}
                  </>
                )}

                {data && data.form_name ==='SCRF' && (
                <Card title="UAT Scenarios" className="mb-10">
                  {data.related_record.uat_scenarios.map((scenario, index) => (
                    <Row key={scenario.id} gutter={[24, 24]} className="mb-10">
                      <Col span={24}>
                        <Typography.Text strong>Scenario {index + 1} ({scenario.status}):</Typography.Text> 
                        <Typography.Paragraph>{scenario.detail}</Typography.Paragraph>
                        
                      </Col>
                    </Row>
                  ))}
                </Card>
              )}
              </Skeleton>

              {/* <Skeleton active loading={loading}>
                {data && data.created_at && (
                  <Card title="General Information" className="mb-10">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10">Department</p>
                        <Tag>{data.department.name}</Tag>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10">Section</p>
                        <Tag>{data.section.name}</Tag>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10">Designation</p>
                        <Tag>{data.designation.name}</Tag>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10">Location</p>
                        <Tag>{data.location.name}</Tag>
                      </Col>
                    </Row>
                  </Card>
                )}
              </Skeleton> */}

              {/* {data && data.assigned_to_users && (
                <Skeleton active loading={loading}>
                  <Card title="User's Feedback" className="mb-10">
                    {data.assigned_to_users.map((user) => (
                      <Row gutter={[16, 16]} key={user.id} className="mt-20">
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Name</p>
                          <Tag>{user.name}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Email</p>
                          <Tag>{user.email}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Status</p>
                          <Tag>{user.status}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Feedback</p>
                          <Tag>{user.feedback || 'No feedback'}</Tag>
                        </Col>
                      </Row>
                    ))}
                  </Card>
                </Skeleton>
              )} */}
            </div>

            <Skeleton active loading={loading}>
              <Card title="Comments" className="mb-10">
                <Row gutter={16}>
                  <Col span={24}>
                    <CommentSystem
                      id={id}
                      form_id={currentFormId}
                      status={data && data.status}
                      comment_status={1}
                    />
                  </Col>
                </Row>
              </Card>
            </Skeleton>
          </Col>
        </Row>
      </Card>
    </DefaultLayout>
  );
};

export default QualityAssuranceDetails;

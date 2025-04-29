import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col, Card, notification, Tag, Skeleton, Spin } from "antd";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import { FormOutlined } from "@ant-design/icons";
import approvalService from "../../services/approver";

import CommentSystem from "../../components/comment";
import CreatedByComponent from "../../components/commonDetails/createdBy";
import ApproversComponent from "../../components/commonDetails/approvers";
import ApproveDisapproveComponent from "../../components/commonDetails/approveDisapprove/index";
import TaskStatus from "../../components/commonDetails/taskStatus";
import mobileRequisitionService from "../../services/mobileRequisition";
import FeedbackModal from "../../components/feedbackModal";
import DeploymentModal from "../../components/deploymentModal";

import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import { useSelector } from "react-redux";

import TaskModal from "../../components/taskModal";


const MobileRequisitionDetails = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const [assignedUserId, setAssignedUserId] = useState(null);
  const { id } = useParams();
  const [formId] = useState(5);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    getMRDetails();
  }, []);

  const getMRDetails = async () => {
    setLoading(true);
    await mobileRequisitionService.getMRDetails(id).then((response) => {
      setData(response);
      setLoading(false);
    });
  };

  const handleSubmit = async (values, isParallel) => {
    setLoading(true);
    const formattedValues = {
      status,
      approved_disapproved: false,
      form_id: 5,
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
          message: "Status",
          description: response.message,
        });
        form.resetFields();
        getMRDetails(id);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

// Comment Condition Updated
  let canComment = 0;
  if(data){
    if(data.status != "Approved" && data.status != "Return"){
      canComment = 1;
    }else{
      if(data.comment_status == 1 ){
      canComment = 1;
      }
    }
  }
  // Comment Condition Updated

  const Isadmin = currentUser.roles.includes("admin");

  //  For hiding next hierarchy to the user 
  let filteredApprovers = [];
  if(data){
    const allApprovers = data.approvers;

    if (Array.isArray(allApprovers)) {
          filteredApprovers = allApprovers.map(approver => ({
            ...approver,
            users: approver.users ? approver.users.filter(user => user.status === 'Processing') : []
        }));

      console.log('filteredApprovers');
        console.log(filteredApprovers);
    } else {
        console.error("allApprovers is not defined or is not an array.");
    }
  }
  //  For hiding next hierarchy to the user 

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="Mobile Requisition Details" />
        </Col>
      </Row>

      <Card style={{ minHeight: "100vh" }}>
        <Row gutter={[24, 24]}>
          <Col lg={5} md={5} sm={24} xs={24}>
            <CreatedByComponent data={data} />
              {data && (data.status === "Pending" || data.status === "Approved") && Isadmin === true && (
                <AddApproversComponent data={data && data} formId = {formId} />
              )}
              {/*<ApproversComponent approvers={data && filteredApprovers} />*/}
              <ApproversComponent approvers={data && data.approvers} />
          </Col>
          <Col lg={19} md={19} sm={24} xs={24}>
            <div>
            {data?.deployments !== null && (
              <DeploymentModal
                  title="Deployments"
                  data_deployment={data?.deployments}
                  style={{ marginright: "0" }}
                />
              )}
              {data?.assigned_task?.assign_task_teams[0]?.members?.some(
                m => m.start_at && m.due_at
              ) && (
                <TaskModal
                  title="Tasks Logs"
                  data_tasks={data.assigned_task.assign_task_teams[0].members}
                  style={{ marginright: "0" }}
                />
              )}
              {data?.approved_disapproved === true && (
                <div
                  style={{
                    position: "sticky",
                    top: 1,
                    zIndex: 999,
                    background: "#fff",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  <Spin spinning={loading}>
                    {data?.task_status?.id !== null && (
                      <FeedbackModal
                        title="QA Feedback"
                        formId={formId}
                        assurable_id={id}
                        style={{ marginright: "0" }}
                      />
                    )}
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

              {data?.parallel_approved_disapproved === true && (
                <div
                  style={{
                    position: "sticky",
                    top: data?.approved_disapproved ? "150px" : "1px", // Adjust the top value as needed
                    zIndex: 999,
                    background: "#fff", // Add a background color
                    padding: "5px", // Add padding for better visual separation
                    borderRadius: "4px", // Optional: Add rounded corners
                  }}
                >
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
                      reloadData={getMRDetails}
                    />
                  </Spin>
                </div>
              )}

              {data?.assigned_task_to_me === true && (
                <div
                  style={{
                    position: "sticky",
                    top: "1px",
                    zIndex: 999,
                    background: "#fff", // Add a background color
                    padding: "5px", // Add padding for better visual separation
                    borderRadius: "4px", // Optional: Add rounded corners
                  }}
                >
                  <TaskStatus
                      data={data}
                      reloadData={getMRDetails}
                      formId={formId}
                    />
                </div>
              )}

              <Skeleton active loading={loading}>
                {data && (
                  <>
                    <Card title="Basic Information" className="mb-10">
                      <Row gutter={[16, 16]}>
                        
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Sequence No</p>
                          <Tag>{data.sequence_no}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Request Title</p>
                          <Tag>{data.request_title}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Status</p>
                          <Tag>{data.status}</Tag>
                        </Col>
                       
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Issue Date</p>
                          <Tag>{new Date(data.issue_date).toLocaleDateString()}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Receive Date</p>
                          <Tag>{new Date(data.recieve_date).toLocaleDateString()}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Make</p>
                          <Tag>{data.make?.name}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Model</p>
                          <Tag>{data.model}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">IMEI</p>
                          <Tag>{data.imei}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Mobile Number</p>
                          <Tag>{data.mobile_number}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Remarks</p>
                          <Tag>{data.remarks}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Request For User</p>
                          <Tag>{data.request_for_user?.name}</Tag>
                        </Col>
                        {data && data.assigned_task?.start_at && (
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 ">Start Date</p>
                          <Tag>{data.assigned_task?.start_at}</Tag>
                        </Col>
                        )}
                        {data && data.assigned_task?.due_at && (
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 ">Deadline</p>
                          <Tag>{data.assigned_task?.due_at}</Tag>
                        </Col>
                        )}
                      </Row>
                    </Card>

                    {/* <Card title="Approvers" className="mb-10">
        <Row gutter={[16, 16]}>
          {data.approvers.map((approver) => (
            <Col xs={24} sm={24} md={24} lg={24} xl={24} key={approver.id}>
              <p className="fs-12 mb-10">{approver.name}</p>
              {approver.users.map((user) => (
                <Tag key={user.id}>{user.name}</Tag>
              ))}
            </Col>
          ))}
        </Row>
      </Card> */}
                  </>
                )}
              </Skeleton>
            </div>

            <Skeleton active loading={loading}>
              <Card title="Comments" className="mb-10">
                <Row gutter={16}>
                  <Col span={24}>
                    <CommentSystem
                      id={id}
                      form_id={5}
                      status={data && data.status}
                      comment_status={data && canComment}
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

export default MobileRequisitionDetails;

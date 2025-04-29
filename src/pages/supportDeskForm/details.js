import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Card, Badge, notification, Tag, Spin, Space, Button } from "antd";
import { FormOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
// import equipmentRequestService from "../../services/equipmentRequest";
import approvalService from "../../services/approver";
import CommentSystem from "../../components/commentNonForm";
import CreatedByComponent from "../../components/commonDetails/createdBy";
import ApproversComponent from "../../components/commonDetails/approvers";
import InventoryShowComponent from "../../components/commonDetails/inventoryShow";
import CurrencyShowComponent from "../../components/commonDetails/currencyShow";
import ApproveDisapproveComponent from "../../components/commonDetails/approveDisapprove";
import TaskStatus from "../../components/commonDetails/taskStatusNonForm";
import FeedbackModal from "../../components/feedbackModal";

import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import { useSelector } from "react-redux";

import supportDeskService from '../../services/supportDesk';
import { getFileNameFromPath, downloadFile } from "../../utils/helper";





const SupportDeskDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [status, setStatus] = useState(null);
  const { id } = useParams();
  const [assignedUserId, setAssignedUserId] = useState(null);
  const navigate = useNavigate();
  const [formId] = useState(1);
  const { currentUser } = useSelector((state) => state.user);


  const getSupportDeskById = async () => {
    setLoading(true);
    await supportDeskService
      .getSupportDeskById(id)
      .then((response) => {
        console.log('response all');
        console.log(response);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("eerir fetch", error)
        // navigate("/crf");
      });
  };

  useEffect(() => {
    getSupportDeskById();
  }, []);

  const handleSubmit = async (values, isParallel) => {
    setLoading(true);
    const formattedValues = {
      status,
      approved_disapproved: false,
      form_id: formId,
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
        getSupportDeskById(id);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      navigate("/dashboard");
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

  console.log('asd')
  console.log(data)
  console.log('asd')
  //  For hiding next hierarchy to the user 
  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="Support Desk Details" />
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Card style={{ minHeight: "100vh" }}>
          <Row gutter={[24, 24]}>
            <Col lg={5} md={5} sm={24} xs={24}>
              <CreatedByComponent data={data} />
              {data && (data.status === "Pending" || data.status === "Approved") && Isadmin === true && (
                <AddApproversComponent data={data && data} formId = {formId} />
              )}
              {/*<ApproversComponent approvers={data && filteredApprovers} />*/}
              {/*<ApproversComponent approvers={data && data.approvers} />*/}
            </Col>

            <Col lg={19} md={19} sm={24} xs={24}>
              <div>
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
                        reloadData={getSupportDeskById}
                      />
                    </Spin>
                  </div>
                )}

                <div className="mb-10">
                  {/*{data?.assigned_task_to_me === true && (*/}
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
                        reloadData={getSupportDeskById}
                        formId={formId}
                        nonform={true}
                      />
                    </div>
                  {/* )}*/}
                </div>

                {data && data.request_title && (
                    <Card title="Basic Information" className="mb-10">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Sequence No</p>
                          <Tag>{data.sequence_no}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Query Title</p>
                          <Tag>{data.request_title}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Priority</p>
                          <Tag>{data.priority}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Sap ID /Windows ID</p>
                          <Tag>{data.relevant_id}</Tag>
                        </Col>

                        {data.task_status?.name && (
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <p className="fs-12 mb-10 bold">Task Status</p>
                            <Tag>{data.task_status.name}</Tag>
                          </Col>
                        )}
                      </Row>

                      <Row gutter={[16, 16]} className="mt-20">
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Department</p>
                          <Tag>{data.department?.name}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Service Required </p>
                          <Tag>{data.service?.name}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Team Required</p>
                          {data.teams.map((team) => (
                            <Tag key={team.id}>{team.name}</Tag> // Display each team name in a separate Tag
                          ))}
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Phone</p>
                          <Tag>{data.phone}</Tag>
                        </Col>

                        {data.task_status?.name && (
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <p className="fs-12 mb-10 bold">Task Status</p>
                            <Tag>{data.task_status.name}</Tag>
                          </Col>
                        )}
                      </Row>
                      <Row gutter={[16, 16]} className="mt-20" >
                         <Col xs={24} sm={12} md={24} lg={24} xl={24}>
                            <p className="fs-12 mb-10">Description</p>
                            <Tag style={{width:'100%'}}>{data?.description}</Tag>
                          </Col>
                      </Row>

                    </Card>
                )}
                {data && data.attachments && (
                      <Card title="Attachments" className="mb-10">
                        <Row gutter={16}>
                          {data.attachments.map((attachment) => (
                            <Col span={24} key={attachment.id}>
                              <Tag className="mb-10">
                                <b>Title:</b>{" "}
                                {getFileNameFromPath(
                                  attachment.original_title
                                ) || getFileNameFromPath(attachment.filename)}
                              </Tag>

                              <div className="attachment-item">
                                <Space direction="horizontal">
                                  <Button
                                    size="small"
                                    className="mb-10"
                                    type="primary"
                                    onClick={() =>
                                      downloadFile(attachment.filename)
                                    }
                                  >
                                    Download
                                  </Button>

                                  {/* <Button
                                size="small"
                                className="mb-10"
                                type="primary"
                                onClick={() =>
                                  deleteFile(attachment.id)
                                }
                              >
                                Delete
                              </Button> */}
                                </Space>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    )}

               

              

                
              </div>

              <CommentSystem
                id={id}
                form_id={formId}
                status={data && data.status}
                comment_status={1}
              />
            </Col>
          </Row>
        </Card>
      </Spin>
    </DefaultLayout>
  );
};

export default SupportDeskDetails;

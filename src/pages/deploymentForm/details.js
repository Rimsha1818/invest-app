import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  notification,
  Tag,
  Descriptions,
  Space,
  Spin,
  Divider,
} from "antd";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import { getFileNameFromPath, downloadFile } from "../../utils/helper";
import { FormOutlined } from "@ant-design/icons";
import deploymentService from "../../services/deployment";
import approvalService from "../../services/approver";

import CommentSystem from "../../components/comment";
import CreatedByComponent from "../../components/commonDetails/createdBy";
import ApproversComponent from "../../components/commonDetails/approvers";
import ApproveDisapproveComponent from "./../../components/commonDetails/approveDisapprove/index";
import TaskStatus from "../../components/commonDetails/taskStatus";
import { replaceLineBreaks } from "../../utils/helper";
import FeedbackModal from "../../components/feedbackModal";

import qaService from "../../services/qualityAssurance";
import csrfService from "../../services/scrf";
import equipmentRequestService from "../../services/equipmentRequest";
import mobileRequisitionService from "../../services/mobileRequisition";

import mdmService from "../../services/mdm";
import { useSelector } from "react-redux";

import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import TaskModal from "../../components/taskModal";

const DeploymentDetails = () => {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [referenceDoumentTitle, setReferenceDoumentTitle] = useState(null);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [assignedUserId, setAssignedUserId] = useState(null);
  const [formId] = useState(3);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    getDeploymentDetails();
    setRefresh(false);
  }, [refresh]);

  const deleteFile = async (id) => {
    setLoading(true);
    await deploymentService
      .deleteDeploymentCommentAttachment(id)
      .then((response) => {
        console.log(response);
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/deployment");
      });
  };

  const getDeploymentDetails = async () => {
    setLoading(true);
    await deploymentService
      .getDeploymentDetails(id)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log('yes error')
        console.log(error)
        // navigate("/deployment");
      });
  };

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
        getDeploymentDetails();
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

  const getQaDetails = async () => {
    await qaService
      .getQaDetails(data.reference_details)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching qa records");
      });
  };
  const getScrfDetails = async () => {
    await csrfService
      .getScrfDetails(data.reference_details)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching scrf records");
      });
  };
  const getEquipmentsRequestById = async () => {
    await equipmentRequestService
      .getEquipmentsRequestById(data.reference_details)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching crf records");
      });
  };
  const getMRDetails = async () => {
    await mobileRequisitionService
      .getMRDetails(data.reference_details)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching mdm records");
      });
  };
  const getMdmDetails = async () => {
    await mdmService
      .getMdmDetails(data.reference_details)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching mdm records");
      });
  };

  const handleRedirect = () => {
    // Define your redirection logic based on form_id
    switch (data.reference_form_id.id) {
      case 1:
        navigate(`/quality-assurance/details/${data.reference_details?.id}`);
        break;
      case 2:
        navigate(`/scrf/details/${data.reference_details?.id}`);
        break;
      case 3:
        navigate(`/deployment/details/${data.reference_details?.id}`);
        window.location.reload();
        // navigate(`/deployment/details/${data.reference_details?.id}`);
        break;
      case 4:
        navigate(`/crf/details/${data.reference_details?.id}`);
        break;
      case 5:
        navigate(`/mobile-requisition/details/${data.reference_details?.id}`);
        break;
      case 6:
        navigate(
          `/master-data-management-form/details/${data.reference_details?.id}`);
        break;
      default:
        navigate("/");
    }
  };

  const referenceDocumentTitle = () => {
    // Define your redirection logic based on form_id
    switch (data.form_id.id) {
      case 1:
        getQaDetails();
        break;
      case 2:
        getScrfDetails();
        break;
      case 3:
        getDeploymentDetails();
        break;
      case 4:
        getEquipmentsRequestById();
        break;
      case 5:
        getMRDetails();
        break;
      case 6:
        getMdmDetails();
        break;
      default:
        return "-";
    }
  };
  if (data && data.form_id) {
    referenceDocumentTitle();
  }
  // const handleAnotherModalOk = () => {
  //   console.log('Another modal confirmed!');
  // };

  // const handleAnotherModalCancel = () => {
  //   console.log('Another modal canceled!');
  // };

  const userArray = [];
  if (data?.approvers) {
    const lastApprover = data.approvers[data.approvers.length - 1];

    if (lastApprover?.users) {
      userArray.push(...lastApprover.users);
    }
  }

  let canUpdateStatus = false;
  const currentId = currentUser.user_id;
  const statusChangeMode = userArray.find(
    (statusChangeMode) =>
      statusChangeMode.id === currentId && statusChangeMode.status == "Approved"
  );

  if (data) {
    if (
      statusChangeMode != null &&
      statusChangeMode !== false &&
      data.deployment_status != "Successful"
    ) {
      canUpdateStatus = true;
    }
    console.log(`data.deployment_status ${data.deployment_status}`);
  } else {
    canUpdateStatus = false;
  }
  console.log(`canUpdateStatus ${canUpdateStatus}`);

  // Comment Condition Updated
  let canComment = 0;
  if (data) {
    if (data.status != "Approved" && data.status != "Return") {
      canComment = 1;
    } else {
      if (data.comment_status == 1) {
        canComment = 1;
      }
    }
  }
  // Comment Condition Updated

  const handleClick = async (status) => {
    console.log(`status ${status} ID:  `, data.id);
    const formData = new FormData();
    formData.append(`deployment_status`, status);

    setLoading(true);
    await deploymentService
      .updateDeploymentStatus(data.id, formData)
      .then((response) => {
        setLoading(false);
        getDeploymentDetails();

        // navigate("/dashboard");
      })
      .catch((error) => {
        // navigate("/dashboard");
      });
  };

  const Isadmin = currentUser.roles.includes("admin");

  //  For hiding next hierarchy to the user
  let filteredApprovers = [];
  if (data) {
    const allApprovers = data.approvers;

    if (Array.isArray(allApprovers)) {
      filteredApprovers = allApprovers.map((approver) => ({
        ...approver,
        users: approver.users
          ? approver.users.filter((user) => user.status === "Processing")
          : [],
      }));

      console.log("filteredApprovers");
      console.log(filteredApprovers);
    } else {
      console.error("allApprovers is not defined or is not an array.");
    }
  }

  console.log('data');
  console.log(data);
  console.log('data');
  //  For hiding next hierarchy to the user
  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="Deployment Details" />
        </Col>
      </Row>
      <Spin spinning={loading}>
        {data?.assigned_task?.assign_task_teams[0]?.members?.some(
            m => m.start_at && m.due_at
          ) && (
            <TaskModal
              title="Tasks Logs"
              data_tasks={data.assigned_task.assign_task_teams[0].members}
              style={{ marginright: "0" }}
            />
        )}
        {data?.task_status?.id !== null && (
          <FeedbackModal
            title="QA Feedback"
            formId={formId}
            assurable_id={id}
            style={{ marginright: "0" }}
          />
        )}
        <Card style={{ minHeight: "100vh" }}>
          <Row gutter={[24, 24]}>
            <Col lg={7} md={7} sm={24} xs={24}>
              <CreatedByComponent data={data} />
              {data &&
                (data.status === "Pending" || data.status === "Approved") &&
                Isadmin === true && (
                  <AddApproversComponent data={data && data} formId={formId} />
                )}
              {/*<ApproversComponent approvers={data && filteredApprovers} />*/}
              <ApproversComponent approvers={data && data.approvers} />
            </Col>
            <Col lg={17} md={17} sm={24} xs={24}>
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
                      <b className="fs-12-c">Approval Request</b>
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
                      top: data?.approved_disapproved ? "150px" : "1px",
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
                        reloadData={getDeploymentDetails}
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
                      reloadData={getDeploymentDetails}
                      formId={formId}
                    />
                  </div>
                )}

                {data && data.request_title && (
                  <>
                    {data.deployment_status && (
                      <Card title="Approval Screen" className="mb-10">
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <p
                              style={{
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              {data.deployment_status}
                            </p>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {data && canUpdateStatus === true && (
                      <Card title="Approval Screen" className="mb-10">
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <button
                              onClick={() => handleClick("Successful")}
                              style={{
                                backgroundColor: "green",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              Successfull
                            </button>
                            <button
                              onClick={() => handleClick("Failure")}
                              style={{
                                backgroundColor: "red",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                            >
                              Failure
                            </button>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    <Card title="Basic Information" className="mb-10">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12-c mb-10 bold">Sequence No</p>
                          <Tag>{data.sequence_no}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12-c mb-10 bold">Deployment Title</p>
                          <Tag>{data.request_title}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12-c mb-10 bold">Change Priority</p>
                          <Tag>{data.change_priority}</Tag>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]} className="mt-10">
                        {data.task_status?.name && (
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <p className="fs-12 mb-10 bold">Task Status</p>
                            <Tag>{data.task_status.name}</Tag>
                          </Col>
                        )}

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12-c mb-10 bold">Location</p>
                          <Tag>{data.location?.name}</Tag>
                        </Col>

                        {data.project_id?.name && (
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <p className="fs-12-c mb-10 bold">Project</p>
                            <Tag>{data.project_id.name}</Tag>
                          </Col>
                        )}

                      </Row>
                    </Card>
                    {data && data.created_at && (
                      <Card
                        title="Reference Document Information"
                        className="mb-10"
                      >
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <p className="fs-12-c mb-10 bold">
                              Reference Document{" "}
                            </p>
                            <Tag style={{ width: "100%" }}>
                              {data?.reference_form_id && data?.reference_form_id.name}
                            </Tag>
                          </Col>

                          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <p className="fs-12-c mb-10 bold">
                              Reference Document Detail
                            </p>
                            <Button type="primary" onClick={handleRedirect}>
                              {data?.reference_details && data?.reference_details.sequence_no}
                              {/*{referenceDoumentTitle}*/}
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    )}
                    {data && data.attachments && (
                      <Card title="Other Attachments" className="mb-10">
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
                    {data && data.deploymentDetail && (
                      <Card title="Details" className="mb-10">
                        {data.deploymentDetail.map((scenario, index) => (
                          <div key={scenario.id}>
                            <Row gutter={[16, 16]} className="mt-20">
                              <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                                <p className="fs-12-c mb-10 bold">
                                  Sequence No:{" "}
                                </p>
                                <Tag style={{ width: "80%" }}> {index + 1}</Tag>
                              </Col>
                              <Col xs={24} sm={12} md={7} lg={7} xl={7}>
                                <p className="fs-12-c mb-10 bold">
                                  Document Number:{" "}
                                </p>
                                <Tag style={{ width: "90%" }}>
                                  {" "}
                                  {scenario.document_no}
                                </Tag>
                              </Col>
                              <Col xs={24} sm={12} md={13} lg={13} xl={13}>
                                <p className="fs-12-c mb-10 bold">
                                  Document Description:{" "}
                                </p>
                                <Tag style={{ minWidth: "100%" }}>
                                  {scenario.detail}
                                </Tag>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </Card>
                    )}
                  </>
                )}
              </div>

              <CommentSystem
                id={id}
                form_id={formId}
                status={data && data.status}
                comment_status={data && canComment}
              />
            </Col>
          </Row>
        </Card>
      </Spin>
    </DefaultLayout>
  );
};

export default DeploymentDetails;

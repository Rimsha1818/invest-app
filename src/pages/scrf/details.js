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
import csrfService from "../../services/scrf";
import approvalService from "../../services/approver";

import CommentSystem from "../../components/comment";
import CreatedByComponent from "../../components/commonDetails/createdBy";
import ApproversComponent from "../../components/commonDetails/approvers";
import ApproveDisapproveComponent from "./../../components/commonDetails/approveDisapprove/index";
import TaskStatus from "../../components/commonDetails/taskStatus";
import { replaceLineBreaks } from "../../utils/helper";
import FeedbackModal from "../../components/feedbackModal";
import DeploymentModal from "../../components/deploymentModal";
import TaskModal from "../../components/taskModal";

import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import { useSelector } from "react-redux";

const ScrfDetails = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [assignedUserId, setAssignedUserId] = useState(null);
  const [formId] = useState(2);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    getScrfDetails();
  }, []);

  const deleteFile = async (id) => {
    setLoading(true);
    await csrfService
      .deleteScrfCommentAttachment(id)
      .then((response) => {
        // console.log(response);
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/scrf");
      });
  };

  const getScrfDetails = async () => {
    setLoading(true);
    await csrfService
      .getScrfDetails(id)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/scrf");
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
        getScrfDetails();
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
  // const handleAnotherModalOk = () => {
  //   console.log('Another modal confirmed!');
  // };

  // const handleAnotherModalCancel = () => {
  //   console.log('Another modal canceled!');
  // };

  // Comment Condition Updated
  let canComment = 0;
  if (data) {
    if (data.status !== "Approved" && data.status !== "Return") {
      canComment = 1;
    } else {
      if (data.comment_status === 1) {
        canComment = 1;
      }
    }
  }
  // Comment Condition Updated
  // console.log("role verification ")
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
  //  For hiding next hierarchy to the user

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="SCRF Details" />
        </Col>
      </Row>
      <Spin spinning={loading}>
        {data?.task_status?.id !== null && (
          <FeedbackModal
            title="QA Feedback"
            formId={formId}
            assurable_id={id}
            style={{ marginright: "0" }}
          />
        )}
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

        <Card style={{ minHeight: "100vh" }}>
          <Row gutter={[24, 24]}>
            <Col lg={5} md={5} sm={24} xs={24}>
              <CreatedByComponent data={data} />

              {data &&
                (data.status === "Pending" || data.status === "Approved") &&
                Isadmin === true && (
                  <AddApproversComponent data={data && data} formId={formId} />
                )}
              {/*<ApproversComponent approvers={data && filteredApprovers} />*/}
              <ApproversComponent approvers={data && data.approvers} />
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
                        reloadData={getScrfDetails}
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
                      reloadData={getScrfDetails}
                      formId={formId}
                    />
                  </div>
                )}

                {data && data.request_title && (
                  <>
                    <Card title="Basic Information" className="mb-10">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 bold">Sequence No</p>
                          <Tag>{data.sequence_no}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 bold">Request Title</p>
                          <Tag>{data.request_title}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={3} xl={3}>
                          <p className="fs-12 mb-10 bold">Change Type</p>
                          <Tag>{data.change_type}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={3} xl={3}>
                          <p className="fs-12 mb-10 bold">Change Priority</p>
                          <Tag>{data.change_priority}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 bold">
                            Change Significance
                          </p>
                          <Tag>{data.change_significance}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 bold">Task Status</p>
                          <Tag>{data.task_status?.name}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 bold">Location</p>
                          <Tag>{data.location?.name}</Tag>
                        </Col>

                        {data && data.assigned_task?.start_at && (
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10 bold">Start Date</p>
                          <Tag>{data.assigned_task?.start_at}</Tag>
                        </Col>
                        )}
                        {data && data.assigned_task?.due_at && (
                        <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                          <p className="fs-12 mb-10 bold">Deadline</p>
                          <Tag>{data.assigned_task?.due_at}</Tag>
                        </Col>
                        )}

                      </Row>
                    </Card>
                    {data && data.created_at && (
                      <Card
                        title="Request Specs & Business Justification"
                        className="mb-10"
                      >
                        <Descriptions>
                          <Descriptions.Item>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: replaceLineBreaks(data.request_specs),
                              }}
                            />
                          </Descriptions.Item>
                        </Descriptions>
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
                    {data &&
                      data.software_category &&
                      data.software_category && (
                        <Card title="Software Information" className="mb-10">
                          <Descriptions>
                            <Descriptions.Item label="Software Category">
                              <Tag>{data.software_category.name}</Tag>
                            </Descriptions.Item>
                          </Descriptions>
                          <span
                            style={{
                              marginLeft: "3px",
                              color: "rgba(0, 0, 0, 0.45)",
                            }}
                          >
                            {" "}
                            Sub-Category:{" "}
                          </span>{" "}
                          {data.software_subcategories.map(
                            (subcategory, index) => (
                              <Tag className="mb-10" key={index}>
                                {subcategory.name},{" "}
                              </Tag>
                            )
                          )}
                        </Card>
                      )}
                    {data && data.uatScenarios && (
                      <Card title="UAT Scenarios" className="mb-10">
                        {data.uatScenarios.map((scenario) => (
                          <div key={scenario.id}>
                            <Row gutter={[16, 16]} className="mt-20">
                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10 bold">
                                  Scenario Details:{" "}
                                </p>
                                <Tag>{scenario.detail}</Tag>
                              </Col>
                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10 bold">
                                  Scenario Status:{" "}
                                </p>
                                <Tag>{scenario.status}</Tag>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </Card>
                    )}
                    <Card title="Additional Information" className="mb-10">
                      <Row>
                        <Col
                          xs={24}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="mb-20"
                        >
                          <p className="fs-12 mb-10 bold">Man Hours Saving</p>
                          {data.man_hours ? <Tag>{data.man_hours}</Tag> : "0"}
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                          <p className="fs-12 mb-10 bold">Other Benefits</p>
                          {data.other_benefits ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: replaceLineBreaks(data.other_benefits),
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                          <p className="fs-12 mb-10 bold">Cost Saved</p>
                          {data.cost_saved ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: replaceLineBreaks(data.cost_saved),
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                          <p className="fs-12 mb-10 bold">Controls Improved</p>
                          {data.controls_improved ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: replaceLineBreaks(
                                  data.controls_improved
                                ),
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </Col>
                        <Col
                          xs={24}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="mt-20"
                        >
                          <p className="fs-12 mb-10 bold">Legal Reasons</p>
                          {data.legal_reasons ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: replaceLineBreaks(data.legal_reasons),
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </Col>
                        {data.process_efficiency && (
                          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <p className="fs-12 mb-10 bold">
                              Business Process Change
                            </p>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: replaceLineBreaks(
                                  data.process_efficiency
                                ),
                              }}
                            />
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </>
                )}
              </div>

              <CommentSystem
                id={id}
                form_id={formId}
                status={data.status}
                comment_status={canComment}
              />
            </Col>
          </Row>
        </Card>
      </Spin>
    </DefaultLayout>
  );
};

export default ScrfDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Card, Badge, notification, Tag, Spin, Space, Button } from "antd";
import { FormOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import equipmentRequestService from "../../services/equipmentRequest";
import approvalService from "../../services/approver";
import CommentSystem from "../../components/comment";
import CreatedByComponent from "../../components/commonDetails/createdBy";
import ApproversComponent from "../../components/commonDetails/approvers";
import InventoryShowComponent from "../../components/commonDetails/inventoryShow";
import CurrencyShowComponent from "../../components/commonDetails/currencyShow";
import ApproveDisapproveComponent from "../../components/commonDetails/approveDisapprove";
import TaskStatus from "../../components/commonDetails/taskStatus";
import FeedbackModal from "../../components/feedbackModal";

import sapService from '../../services/sap';


// FOR IMAGE 
import { getFileNameFromPath, downloadFile } from "../../utils/helper";

import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import { useSelector } from "react-redux";
import TaskModal from "../../components/taskModal";

const SapDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [status, setStatus] = useState(null);
  const { id } = useParams();
  const [assignedUserId, setAssignedUserId] = useState(null);
  const navigate = useNavigate();
  const [formId] = useState(7);
  const { currentUser } = useSelector((state) => state.user);


  const getSapById = async () => {
    setLoading(true);
    await sapService
      .getSapById(id)
      .then((response) => {
        console.log('response')
        console.log(response)
        console.log('response')
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/sap-access-form");
      });
  };

  useEffect(() => {
    getSapById();
  }, []);

  const handleSubmit = async (values, isParallel) => {
    setLoading(true);
    const formattedValues = {
      status,
      approved_disapproved: false,
      form_id: 7,
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
        getSapById(id);
        navigate("/dashboard");

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

const locationOptions = [
    { id: 1, name: "Head Office" },
    { id: 2, name: "Karachi Plant" },
    { id: 3, name: "Pezu Plant" },
    { id: 4, name: "Area Office" },
    { id: 5, name: "Islamabad" },
    { id: 6, name: "Lahore" },
    { id: 7, name: "Peshawar" },
    { id: 8, name: "Multan" },
    { id: 9, name: "Faisalabad" },
    { id: 10, name: "Quetta" },
];
  const plantOptions = [
  { id: 1, name: "PIBT" },
  { id: 2, name: "QICT" },
  { id: 3, name: "LCHO" },
  { id: 4, name: "LCKP" },
  { id: 5, name: "LCPZ" },
  { id: 6, name: "LKPT" },
  { id: 7, name: "PKGP" },
  { id: 8, name: "PGPZ" },
];
  // Comment Condition Updated
  const Isadmin = currentUser.roles.includes("admin");

  //  For hiding next hierarchy to the user 
  // let filteredApprovers = [];
  // if(data){
  //   const allApprovers = data.approvers;

  //   if (Array.isArray(allApprovers)) {
  //         filteredApprovers = allApprovers.map(approver => ({
  //           ...approver,
  //           users: approver.users ? approver.users.filter(user => user.status === 'Processing') : []
  //       }));

  //     console.log('filteredApprovers');
  //       console.log(filteredApprovers);
  //   } else {
  //       console.error("allApprovers is not defined or is not an array.");
  //   }
  // }

  //  const renderSection = (title, items, fields) => {
  //   if (!items || items.length === 0) return null;

  //   return (
  //   <Card title={title} className="mb-10">
  //     {items.map((item, index) => (
  //       <Row gutter={[16, 16]} className="mt-20" key={index}>
  //         {fields
  //           .filter((field) => item[field.key]) // Filter out empty values
  //           .map((field) => (
  //             <Col xs={24} sm={12} md={8} lg={6} xl={6} key={field.key}>
  //               <p className="fs-12 mb-10 bold">{field.label}</p>
  //               <Tag style={{ width: "80%" }}>{item[field.key]}</Tag>
  //             </Col>
  //           ))}
  //       </Row>
  //     ))}
  //   </Card>
  //   );
  // };
// const renderSection = (title, items, fields) => {
//     if (!items || items.length === 0) return null;

//     // Filter out items that have all null values
//     const validItems = items.filter(item =>
//       fields.some(field => item[field.key] !== null && item[field.key] !== 'null' && item[field.key] !== "")
//     );

//     if (validItems.length === 0) return null; // Hide section if no valid items remain

//     // console.log('Label',validItems);
//     console.log('validItems',validItems,'--->',title);
//     return (
//       <Card title={title} className="mb-10">
//         {validItems.map((item, index) => (
//           <Row gutter={[16, 16]} className="mt-20" key={index}>
//             {fields
//               .filter(field => item[field.key]) // Show only non-null values
//               .map(field => (
//                 <Col xs={24} sm={12} md={8} lg={6} xl={6} key={field.key}>
//                   <p className="fs-12 mb-10 bold">{field.label}</p>
//                   <Tag style={{ width: "80%" }}>{item[field.key]}</Tag>
//                 </Col>
//               ))}
//           </Row>
//         ))}
//       </Card>
//     );
//   };

const renderSection = (title, items, fields) => {
    if (!items || items.length === 0) return null;

    // Filter out items that have all null, empty, or undefined values
    const validItems = items.filter(item =>
      fields.some(field => {
        const value = item[field.key];
        return value !== null && value !== "null" && value !== "" && value !== undefined;
      })
    );

    if (validItems.length === 0) return null; // Hide section if no valid items remain

    console.log('validItems', validItems, '--->', title);
    return (
      <Card title={title} className="mb-10">
        {validItems.map((item, index) => (
          <Row gutter={[16, 16]} className="mt-20" key={index}>
            {fields
              .filter(field => {
                const value = item[field.key];
                return value !== null && value !== "null" && value !== "" && value !== undefined;
              })
              .map(field => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={field.key}>
                  <p className="fs-12 mb-10 bold">{field.label}</p>
                  <Tag style={{ width: "80%" }}>{item[field.key]}</Tag>
                </Col>
              ))}
          </Row>
        ))}
      </Card>
    );
};

  //  For hiding next hierarchy to the user 
  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="SAP Access Form Details" />
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
              <ApproversComponent approvers={data && data.approvers} />
            </Col>

            <Col lg={19} md={19} sm={24} xs={24}>
              <div>
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
                        reloadData={getSapById}
                      />
                    </Spin>
                  </div>
                )}

                <div className="mb-10">
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
                        reloadData={getSapById}
                        formId={formId}
                      />
                    </div>
                  )}
                </div>

                {data && data.request_title && (
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
                          <p className="fs-12 mb-10">Location</p>
                          {data?.data?.location?.map((location) => {
                            const matchedLocation = locationOptions.find(option => Number(option.id) === Number(location.id));

                            return (
                              <Tag key={location.id}>
                                {matchedLocation ? matchedLocation.name : "Unknown Location"}
                              </Tag>
                            );
                          })}
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
                          <p className="fs-12 mb-10">Company</p>
                          <Tag>{data.company?.name}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Type</p>
                          <Tag>{data.type}</Tag>
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

                        {data.type && data.type === "Modification" && (
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                          <p className="fs-12 mb-10">Current Sap Id</p>
                          <Tag>{data.sap_id}</Tag>
                        </Col>
                        )}

                        
                      </Row>
                    </Card>
                )}

                {data && (
                  <Card title="Required ID & Access on Module(s)" className="mb-10">
                    <Row  gutter={[16, 16]} className="mt-20" >

                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10 bold">Roles Required</p>
                        <Tag>{data?.roles_required}</Tag>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10 bold">T.Code Required</p>
                        <Tag>{data?.tcode_required}</Tag>
                      </Col>
                      
                       <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10 bold">Plant</p>
                          {data?.data?.plant?.map((plant) => {
                            const matchedPlant = plantOptions.find(option => Number(option.id) === Number(plant.id));
                            return (
                              <Tag key={plant.id}>
                                {matchedPlant ? matchedPlant.name : "Unknown plant"}
                              </Tag>
                            );
                          })}
                        </Col>

                    </Row>

                    <Row  gutter={[16, 16]} className="mt-20" >
                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <p className="fs-12 mb-10 bold">Business Justification</p>
                        <Tag>{data.business_justification}</Tag>
                      </Col>
                    </Row>
                  </Card>
                )}

                

                {renderSection("Sales Distribution", data?.data?.sales_distribution, [
                  { key: "sales_organization", label: "Sales Organization" },
                  { key: "distribution_channel", label: "Distribution Channel" },
                  { key: "division", label: "Division" },
                  { key: "sales_office", label: "Sales Office" },
                  { key: "sales_group", label: "Sales Group" },
                  { key: "other_details", label: "Other Details" },
                ])}
                {renderSection("Material Management", data?.data?.material_management, [
                  { key: "purchasing_org", label: "Purchasing Org" },
                  { key: "purchasing_group", label: "Purchasing Group" },
                  { key: "storage_location", label: "Storage Location" },
                  { key: "purchasing_document", label: "Purchasing Document" },
                  { key: "movement_type", label: "Movement Type" },
                  { key: "other_details", label: "Other Details" },
                ])}
                {renderSection("Plant Maintenance", data?.data?.plant_maintenance, [
                  { key: "planning_plant", label: "Planning Plant" },
                  { key: "maintenance_plant", label: "Maintenance Plant" },
                  { key: "work_centers", label: "Work Centers" },
                  { key: "other_details", label: "Other Details" },
                ])}
                {renderSection("Financial Accounting & Costing", data?.data?.financial_accounting_costing, [
                  { key: "profile_center", label: "Profile Center" },
                  { key: "cost_center", label: "Cost Center" },
                  { key: "other_details", label: "Other Details" },
                ])}
                {renderSection("Production Planning", data?.data?.production_planning, [
                  { key: "other_details", label: "Other Details" },
                ])}
                {renderSection("Human Resource", data?.data?.human_resource, [
                  { key: "personnel_area", label: "Personnel Area" },
                  { key: "sub_area", label: "Sub Area" },
                  { key: "cost_center", label: "Cost Center" },
                  { key: "employee_group", label: "Employee Group" },
                  { key: "employee_sub_group", label: "Employee Sub Group" },
                  { key: "other_details", label: "Other Details" },
                ])}

              
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
                form_id={7}
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

export default SapDetails;

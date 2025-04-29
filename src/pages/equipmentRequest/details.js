import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Card,
  Badge,
  notification,
  Tag,
  Spin,
  Button,
  Table,
  Space,
  Divider,
  Tooltip,
} from "antd";
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
import AddApproversComponent from "../../components/commonDetails/manageApprovers";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PDFInventoryShowComponent from "../../components/commonDetails/inventoryShow/pdf";
import crfSetting from '../../services/crfSetting';
import DeploymentModal from "../../components/deploymentModal";
import TaskModal from "../../components/taskModal";

const EquipmentRequestDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [status, setStatus] = useState(null);
  const { id } = useParams();
  const [assignedUserId, setAssignedUserId] = useState(null);
  const navigate = useNavigate();
  const [formId] = useState(4);
  const { currentUser } = useSelector((state) => state.user);
  const [crfSettingData, setCrfSettingData] = useState([]);
  const [editInvMode, setEditInvMode] = useState(false);
  const [isPrintable, setIsPrintable] = useState(false);
  const [hasHighExpenseRevenue, setHasHighExpenseRevenue] = useState(false);
  const [filteredApprovers, setFilteredApprovers] = useState([]);

  const handlePrintClick = () => {
    setIsPrintable(true);
    setTimeout(() => {
      window.print();
      setIsPrintable(false);
    }, 2000);
  };

  const generatePDF = () => {
    const input = document.getElementById("ppp");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = 290;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("request-data.pdf");
    });
  };

  const getCrfSettings = async () => {
    setLoading(true);
    try {
      const response = await crfSetting.getCrfSettings();
      const crfSettingsData = response.data[0];
      setCrfSettingData(crfSettingsData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: 'error',
      });
    }
  };

  useEffect(() => {
    getCrfSettings();
  }, []);

  const getEquipmentsRequestById = async () => {
    setLoading(true);
    await equipmentRequestService
      .getEquipmentsRequestById(id)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/crf");
      });
  };

  useEffect(() => {
    getEquipmentsRequestById();
  }, []);

  useEffect(() => {
    if (data) {
      const mergedRequests = [
        ...(data.equipmentRequests || []),
        ...(data.softwareRequests || []),
        ...(data.serviceRequests || []),
      ];

      // Check for Revenue requests with high expense (>500,000)
      const highExpenseRevenue = mergedRequests.some(request =>
        request.expense_nature?.name === "Revenue" &&
        (JSON.parse(request.asset_details || '[]')).some(asset =>
          asset.expected_expense > 500000
        )
      );
      setHasHighExpenseRevenue(highExpenseRevenue);

      const approvers = data.approvers || [];
      const filtered = approvers.filter(approver => {
        const isRevenueApprover = approver.condition === 8;
        if (isRevenueApprover) {
          const hasRevenueRequest = mergedRequests.some(
            req => req.expense_nature?.name === "Revenue"
          );

          return hasRevenueRequest ? highExpenseRevenue : true;
        }
        return true; // Keep all other approvers
      });
      setFilteredApprovers(filtered);
    }
  }, [data]);

  const handleSubmit = async (values, isParallel) => {
    setLoading(true);
    const formattedValues = {
      status,
      approved_disapproved: false,
      form_id: 4,
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
        getEquipmentsRequestById(id);
      }
      navigate("/dashboard");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  // Comment Condition
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

  const Isadmin = currentUser.roles.includes("admin");

  // let filteredApprovers = [];
  if (data) {
    // For Checking Revenue and Capital in the current form
    const hasExpenseNatureOne = data.equipmentRequests?.some(
      (request) => request.expense_nature?.id === 1
    );
    const hasExpenseNatureTwo = data.equipmentRequests?.some(
      (request) => request.expense_nature?.id === 2
    );

    let expCap = 0;
    let expRev = 0;
    let purCondition = 0;

    if (hasExpenseNatureOne) {
      expCap = 7;
    }
    if (hasExpenseNatureTwo) {
      expRev = 8;
    }
    // For Checking Revenue and Capital in the current form

    // For Checking Purchase in the current form

    const parsedEquipmentRequests = data.equipmentRequests?.map((request) => {
      const newRequest = { ...request };

      if (typeof newRequest.asset_details === "string") {
        try {
          newRequest.asset_details = JSON.parse(newRequest.asset_details);
        } catch (e) {
          console.error("Failed to parse asset_details:", e);
          newRequest.asset_details = [];
        }
      }

      return newRequest;
    });

    const hasPurchaseAction = parsedEquipmentRequests?.some((request) =>
      request.asset_details?.some((detail) => detail.action === "Purchase")
    );

    if (hasPurchaseAction) {
      purCondition = 9;
    }

    // console.log(hasPurchaseAction);
    // console.log(parsedEquipmentRequests);
    // // For Checking Purchase in the current form

    // const allApprovers = data.approvers;
    // console.log("allApprovers");
    // console.log(allApprovers);

    // console.log("data");
    // console.log(data);

    // if (Array.isArray(allApprovers)) {
    //   filteredApprovers = allApprovers.map((approver) => ({
    //     ...approver,
    //     users:
    //       approver.condition === "" ||
    //       approver.condition === null ||
    //       approver.condition === purCondition ||
    //       approver.condition === expCap ||
    //       approver.condition === expRev
    //         ? approver.users || []
    //         : approver.users
    //         ? approver.users.filter((user) => user.status === "Approved")
    //         : [],
    //   }));
    // } else {
    //   console.error("allApprovers is not defined or is not an array.");
    // }
  }

    // const mergedRequests = [
    //   ...(data.equipmentRequests || []),
    //   ...(data.softwareRequests || []),
    //   ...(data.serviceRequests || []),
    // ];


    // const hasHighExpense = mergedRequests.some(request =>
    //   request.expense_nature?.name === "Revenue" &&
    //   (JSON.parse(request.asset_details || '[]') || []).some(asset => asset.expected_expense > 500000)
    // );

    // if (!hasHighExpense) {
    //     data.approvers = data?.approvers?.filter(approver => approver.condition !== 8);
    // }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "yellow";
      default:
        return "blue";
    }
  };

  // const tableData = data.approvers?.flatMap((approver) =>
  //   approver.users
  //     .filter(user => !(user.is_parallel === false && user.status === "Approved" && user.responded_by?.id !== user.id))
  //     .map(user => ({
  //       approverName: approver.name,
  //       userName: user.name,
  //       status: user.status,
  //       status_at: user.status_at,
  //     }))
  // );

  console.log('filteredApproversfilteredApprovers')
  console.log(filteredApprovers)
  console.log('filteredApproversfilteredApprovers')
  // const tableData = filteredApprovers?.flatMap((approver) =>
  //   approver.users
  //     .filter(user => !(user.is_parallel === false && (user.status === "Approved" || user.status === "Disapproved" || user.status === "Return")
  //      && (user.responded_by?.id !== user.id && user.status_at) ))
  //     .map(user => ({
  //       approverName: approver.name,
  //       userName: user.name,
  //       status: user.status,
  //       status_at: user.status_at,
  //     }))
  // );

  const tableData = filteredApprovers?.flatMap((approver) =>
  approver.users
    .filter(user =>
      user.status_at && // only users with a datetime in status_at
      !(user.is_parallel === false &&
        (user.status === "Approved" || user.status === "Disapproved" || user.status === "Return") &&
        (user.responded_by?.id !== user.id && user.status_at))
    )
    .map(user => ({
      approverName: approver.name,
      userName: user.name,
      status: user.status,
      status_at: user.status_at,
    }))
);

  const columns = [
    {
      title: "Approver Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag style={{fontSize:'11px'}} color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Action Performed at",
      dataIndex: "status_at",
      key: "status_at",
    },
  ];

  const adjustPageBreak = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const viewportHeight = window.innerHeight;
    const elementBottom = element.getBoundingClientRect().bottom;
    const remainingSpace = viewportHeight - elementBottom;

    if (remainingSpace < 20) {
      element.style.pageBreakBefore = "always";
    } else {
      element.style.pageBreakBefore = "auto";
    }
  };

  const inventoryVisibility = () => {
    if(data){
      const currentId = currentUser.user_id;
      const formInitUser = data?.created_by?.id;

      if(formInitUser != currentId){
          setEditInvMode(true)
      }else{
          setEditInvMode(false)
      }
    }
  }

  useEffect(() => {
    adjustPageBreak("pbb");
    inventoryVisibility();
  }, [data]);

  const componentss = {
    header: {
      cell: (props) => <th {...props} style={{ fontSize: "10px" }} />,
    },
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FormOutlined />} title="CRF Request Details" />
        </Col>
      </Row>

      <Spin spinning={loading}>
        {isPrintable && (
          <Card
            style={{ minHeight: "100vh", marginLeft: "-200px", marginTop: "-50px", border: "none" }}
            id="ppp"
          >
            <Row gutter={[24, 24]}>

              <Col lg={4} md={4} sm={4} xs={4}>
               <img
                src={
                  currentUser.company?.logo
                    ? currentUser.company.logo.replace("/uploads", "") // Removes '/uploads'
                    : "https://www.lucky-cement.com/wp-content/uploads/2017/02/lucky-logo.png"
                }
                alt="Logo"
                style={{ height: "40px", width: "auto" }}
              />
              </Col>

              <Col lg={16} md={16} sm={16} xs={16}>
                <h2 style={{paddingTop:'', textAlign:'center'}}><strong> CRF Request Details </strong></h2>
              </Col>

              <Col lg={4} md={4} sm={4} xs={4}>
              <h3> Internal </h3>
              </Col>

              {/*<Col span={24}>
                <h1 style={{ textAlign: "center" }}>
                  <strong>CRF Request Details</strong>
                </h1>
              </Col>*/}

              <Col lg={24} md={24} sm={24} xs={24}>
                <div>
                  {data && data.request_title && (
                    <Badge.Ribbon text={`Grand Total ${parseFloat(data.grand_total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${crfSettingData?.data?.[0]?.crf_currency || 'PKR'}`}>
                      <Card
                        // title="Basic Information"
                        title={<span style={{ fontSize: "14px" }}>Basic Information</span>}
                        className="mb-5"
                        style={{ border: "none" }}
                      >
                        <Row gutter={[6, 6]}>
                          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                            <span className="fs-10 mb-10">
                              <strong>Sequence No</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "50%" }}>
                              &nbsp;{data.sequence_no}
                            </Tag>
                          </Col>

                          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                            <span className="fs-10 mb-10">
                              <strong>Cost Center</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "60%" }}>
                              &nbsp;{data.cost_center_id?.cost_center}
                            </Tag>
                          </Col>

                          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                            <span className="fs-10 mb-10">
                              <strong>Location</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "70%" }}>
                              &nbsp;{data.location?.name}
                            </Tag>
                          </Col>
                          {data.for_department && (
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                              <span className="fs-10 mb-10">
                                <strong>Department</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "60%" }}
                              >
                                &nbsp;{data.for_department?.name}
                              </Tag>
                            </Col>
                          )}
                          {data.for_employee && (
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                              <span className="fs-10 mb-10">
                                <strong>Emp Name/Code</strong>
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "74%" }}
                              >
                                &nbsp;{data.for_employee}
                              </Tag>
                            </Col>
                          )}
                          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <span className="fs-10 mb-10">
                              <strong>Title</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "9px", minWidth: "91%" }}>
                              &nbsp;{data.request_title}
                            </Tag>
                          </Col>

                        </Row>
                      </Card>
                    </Badge.Ribbon>
                  )}

                {data?.equipmentRequests?.length > 0 && (
                    <Card title={<span style={{ fontSize: "14px" }}>Equipment Information</span>} className="mb-5">
                      {data.equipmentRequests.map((equipmentRequest, index) => (
                        <div key={index}>
                        <h3 className="mb-5"><strong>{`Equipment Request ${index + 1}`}</strong></h3>
                        <Row key={index} gutter={[6, 6]} className="">

                          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                            <span className="fs-10 mb-10">
                              <strong>Eq Name</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "50%" }}>
                              &nbsp;{equipmentRequest.equipment.name}
                            </Tag>
                          </Col>

                          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                            <span className="fs-10 mb-10">
                              <strong>Qty</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "60%" }}>
                              &nbsp;{equipmentRequest.qty}
                            </Tag>
                          </Col>


                          <Col xs={24} sm={6} md={6} lg={6} xl={5}>
                            <span className="fs-10 mb-10">
                              <strong>Exp Type</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "50%" }}>
                              &nbsp;{equipmentRequest.expense_type.name}
                            </Tag>
                          </Col>

                          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                            <span className="fs-10 mb-10">
                              <strong>Exp Nature</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "50%" }}>
                              &nbsp;{equipmentRequest.expense_nature.name}
                            </Tag>
                          </Col>

                          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-10 mt-10">
                            <span className="fs-10 mb-10">
                              <strong>Business Justification</strong>&nbsp;
                            </span>
                            <Tag style={{ fontSize: "10px", minWidth: "80%", minHeight: "35px" }}>
                              &nbsp;{equipmentRequest.business_justification}
                            </Tag>
                          </Col>

                          {editInvMode && (
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {/*<Card>*/}
                               <h3 className="mb-5"><strong>To be filled by related department:</strong></h3>

                              <Row>
                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Currency</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "50%",
                                    }}
                                  >
                                    &nbsp;{equipmentRequest.currency}
                                  </Tag>
                                </Col>

                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Price</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "60%",
                                    }}
                                  >
                                    &nbsp;{parseFloat(equipmentRequest.amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </Tag>
                                </Col>

                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Exchange Rate</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "42%",
                                    }}
                                  >
                                    &nbsp;{parseFloat(equipmentRequest.rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                                  </Tag>
                                </Col>

                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Total ({crfSettingData?.data?.[0]?.crf_currency || 'PKR'})</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "50%",
                                    }}
                                  >
                                    &nbsp;{parseFloat(equipmentRequest.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    {/*{parseFloat(equipmentRequest.total).toFixed(
                                      2
                                    )}*/}
                                  </Tag>
                                </Col>
                              </Row>
                            {/*</Card>*/}

                          </Col>
                          )}
                          {editInvMode && (

                          <Col span={24}>
                            {equipmentRequest.asset_details &&
                              JSON.parse(equipmentRequest.asset_details).map(
                                (assetDetail, innerIndex) => (
                                  <div
                                    key={innerIndex}
                                    className="pbb"
                                    id="pbb"
                                  >
                                    <Divider style={{ marginTop:'5px' ,marginBottom:'5px'}} />
                                    <Tag
                                      color="blue"
                                      className="fs-10 mt-5 mb-5"
                                      style={{fontSize:'9px', marginTop:'0px' ,marginBottom:'0px'}}
                                    >
                                      Equipment Inventory Asset Details{" "}
                                      {innerIndex + 1}
                                    </Tag>
                                    <div style={{ height: "0px" }} />
                                    <Card
                                      key={innerIndex}
                                      label="Equipment Inventory Asset Details"
                                    >
                                      <PDFInventoryShowComponent
                                        key={innerIndex}
                                        assetDetail={assetDetail}
                                        currency={equipmentRequest.currency}
                                        crfSettingData = {crfSettingData}
                                      />
                                    </Card>
                                  </div>
                                )
                              )}
                          </Col>
                          )}
                        </Row>
                        </div>
                      ))}
                    </Card>
                  )}

                  {data &&
                    data.softwareRequests &&
                    data.softwareRequests.length > 0 && (
                    <Card title={<span style={{ fontSize: "14px" }}>Software Information</span>} className="mb-5">
                      {/*<Card title="Software Information" className="mb-10">*/}
                        {data.softwareRequests.map((softwareRequest, index) => (
                        <div key={index}>
                          <Row key={index} gutter={[6, 6]} className="">
                            <Col xs={24} sm={5} md={5} lg={5} xl={5}>
                              <span className="fs-10 mb-10">
                                <strong>Software Name</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "40%" }}
                              >
                                &nbsp;{softwareRequest.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={5} md={5} lg={5} xl={5}>
                              <span className="fs-10 mb-10">
                                <strong>Version</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "60%" }}
                              >
                                &nbsp;{softwareRequest.version}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={4} md={8} lg={4} xl={4}>
                              <span className="fs-10 mb-10">
                                <strong>Quantity</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "50%" }}
                              >
                                &nbsp;{softwareRequest.qty}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={5} md={5} lg={5} xl={5}>
                              <span className="fs-10 mb-10">
                                <strong>Exp Type</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "62%" }}
                              >
                                &nbsp;{softwareRequest.expense_type.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={5} md={5} lg={5} xl={5}>
                              <span className="fs-10 mb-10">
                                <strong>Exp Nature</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "40%" }}
                              >
                                &nbsp;{softwareRequest.expense_nature.name}
                              </Tag>
                            </Col>


                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-10 mt-10">
                                <span className="fs-10 mb-10">
                                  <strong>Business Justification</strong>&nbsp;
                                </span>
                                <Tag style={{ fontSize: "10px", minWidth: "80%", minHeight: "35px" }}>
                                  &nbsp;{softwareRequest.business_justification}
                              </Tag>
                          </Col>

                          {editInvMode && (

                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {/*<Card>*/}
                              <h3 className="mb-5"><strong>To be filled by related department:</strong></h3>

                              <Row>
                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Currency</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "50%",
                                    }}
                                  >
                                    &nbsp;{softwareRequest.currency}
                                  </Tag>
                                </Col>

                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Price</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "60%",
                                    }}
                                  >
                                    &nbsp;{parseFloat(softwareRequest.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </Tag>
                                </Col>

                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Exchange Rate</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "42%",
                                    }}
                                  >
                                    {/*&nbsp;{softwareRequest.rate}*/}
                                    &nbsp;{parseFloat(softwareRequest.rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                                  </Tag>
                                </Col>

                                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                  <span className="fs-10 mb-10">
                                    <strong>Total ({crfSettingData?.data?.[0]?.crf_currency || 'PKR'})</strong>&nbsp;
                                  </span>
                                  <Tag
                                    style={{
                                      fontSize: "10px",
                                      minWidth: "50%",
                                    }}
                                  >
                                    &nbsp;{parseFloat(softwareRequest.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    {/*{parseFloat(softwareRequest.total).toFixed(
                                      2
                                    )}*/}
                                  </Tag>
                                </Col>
                              </Row>
                            {/*</Card>*/}
                          </Col>
                          )}
                          {editInvMode && (

                            <Col span={24}>
                              {softwareRequest.asset_details &&
                                JSON.parse(softwareRequest.asset_details).map(
                                  (assetDetail, innerIndex) => (
                                    <div key={innerIndex} className="">
                                      <Divider style={{ marginTop:'5px' ,marginBottom:'5px'}} />
                                      <Tag
                                        color="blue"
                                        className="fs-10 mt-5 mb-5"
                                        style={{fontSize:'9px', marginTop:'0px' ,marginBottom:'0px'}}

                                      >
                                        Software Inventory Asset Details{" "}
                                        {innerIndex + 1}
                                      </Tag>
                                      <Card
                                        key={innerIndex}
                                        label="Software Inventory Asset Details"
                                        className="mb-10"
                                      >
                                        <PDFInventoryShowComponent
                                          key={innerIndex}
                                          assetDetail={assetDetail}
                                          currency={softwareRequest.currency}
                                          crfSettingData = {crfSettingData}
                                        />
                                      </Card>
                                    </div>
                                  )
                                )}
                            </Col>
                            )}
                          </Row>
                          </div>
                        ))}
                      </Card>
                    )}

                  {data &&
                    data.serviceRequests &&
                    data.serviceRequests.length > 0 && (
                    <Card title={<span style={{ fontSize: "14px" }}>Service Information</span>} className="mb-5">
                      {/*<Card title="Service Information" className="mb-10">*/}
                        {data.serviceRequests.map((serviceRequest, index) => (
                          <div key={index}>
                          <Row key={index} gutter={[6, 6]} className="">

                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                              <span className="fs-10 mb-10">
                                <strong>Service Name</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "50%" }}
                              >
                                &nbsp;{serviceRequest.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                              <span className="fs-10 mb-10">
                                <strong>State</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "60%" }}
                              >
                                &nbsp;{serviceRequest.state.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                              <span className="fs-10 mb-10">
                                <strong>Exp Type</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "60%" }}
                              >
                                &nbsp;{serviceRequest.expense_type.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                              <span className="fs-10 mb-10">
                                <strong>Exp Nature</strong>&nbsp;
                              </span>
                              <Tag
                                style={{ fontSize: "10px", minWidth: "51%" }}
                              >
                                &nbsp;{serviceRequest.expense_nature.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-10 mt-10">
                              <span className="fs-10 mb-10">
                                <strong>Business Justification</strong>&nbsp;
                              </span>
                              {/*<Tag
                                style={{ fontSize: "10px", minWidth: "30px" }}
                              >
                                &nbsp;{serviceRequest.business_justification}
                              </Tag>*/}
                              <Tag style={{ fontSize: "10px", minWidth: "80%", minHeight: "35px" }}>&nbsp;{serviceRequest.business_justification}</Tag>

                            </Col>


                            {editInvMode &&(
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              {/*<Card>*/}
                              <h3 className="mb-5"><strong>To be filled by related department:</strong></h3>


                                <Row>

                                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                    <span className="fs-10 mb-10">
                                      <strong>Currency</strong>&nbsp;
                                    </span>
                                    <Tag
                                      style={{
                                        fontSize: "10px",
                                        minWidth: "50%",
                                      }}
                                    >
                                      &nbsp;{serviceRequest.currency}
                                    </Tag>
                                  </Col>

                                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                    <span className="fs-10 mb-10">
                                      <strong>Price</strong>&nbsp;
                                    </span>
                                    <Tag
                                      style={{
                                        fontSize: "10px",
                                        minWidth: "60%",
                                      }}
                                    >
                                      &nbsp;{parseFloat(serviceRequest.amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Tag>
                                  </Col>

                                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                    <span className="fs-10 mb-10">
                                      <strong>Exchange Rate</strong>&nbsp;
                                    </span>
                                    <Tag
                                      style={{
                                        fontSize: "10px",
                                        minWidth: "42%",
                                      }}
                                    >
                                      {/*&nbsp;{serviceRequest.rate}*/}
                                      &nbsp;{parseFloat(serviceRequest.rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                                    </Tag>
                                  </Col>

                                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                    <span className="fs-10 mb-10">
                                      <strong>Total ({crfSettingData?.data?.[0]?.crf_currency || 'PKR'})</strong>&nbsp;
                                    </span>
                                    <Tag
                                      style={{
                                        fontSize: "10px",
                                        minWidth: "50%",
                                      }}
                                    >
                                      &nbsp;{parseFloat(serviceRequest.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      {/*{parseFloat(serviceRequest.total).toFixed(
                                        2
                                      )}*/}
                                    </Tag>
                                  </Col>
                                </Row>
                              {/*</Card>*/}
                            </Col>

                            )}
                            {editInvMode &&(


                            <Col span={24}>
                              {serviceRequest.asset_details &&
                                JSON.parse(serviceRequest.asset_details).map(
                                  (assetDetail, innerIndex) => (
                                    <div key={innerIndex} className="">
                                      <Divider style={{ marginTop:'5px' ,marginBottom:'5px'}} />
                                      <Tag
                                        color="blue"
                                        className="fs-10 mt-5 mb-5"
                                        style={{fontSize:'9px', marginTop:'0px' ,marginBottom:'0px'}}
                                      >
                                        Service Inventory Asset Details{" "}
                                        {innerIndex + 1}
                                      </Tag>
                                      <Card
                                        key={innerIndex}
                                        label="Service Inventory Asset Details"
                                        className="mb-10"
                                      >
                                        <PDFInventoryShowComponent
                                          key={innerIndex}
                                          assetDetail={assetDetail}
                                          currency={serviceRequest.currency}
                                          crfSettingData = {crfSettingData}
                                        />
                                      </Card>
                                    </div>
                                  )
                                )}
                            </Col>
                            )}

                          </Row>
                          </div>
                        ))}
                      </Card>
                    )}
                </div>
              </Col>
            </Row>

            <Card
              title={<span style={{ fontSize: "14px" }}>Created By</span>}
              // title="Created By"
              className=""
              // style={{ border: "none"}}
              style={{ border: "none", pageBreakBefore: "always", margin:'-10px' }}
            >
              {data && data.created_by && (
                <>
                  <Row gutter={[8, 8]} className="">

                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <span className="fs-10 "><strong>Created At</strong>&nbsp;</span>
                      <Tag style={{ fontSize: "10px", minWidth: "65%" }} >&nbsp;{data.created_at} </Tag>
                    </Col>

                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <span className="fs-10 "><strong>Name</strong>&nbsp;</span>
                      <Tag style={{ fontSize: "10px", minWidth: "65%" }} >&nbsp;{data.created_by.name} </Tag>
                    </Col>

                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <span className="fs-10 "><strong>Department:</strong>&nbsp;</span>
                      <Tag style={{ fontSize: "10px", minWidth: "65%" }} >&nbsp;{data.department.name} </Tag>
                    </Col>

                  </Row>

                </>
              )}
            </Card>
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey="userName"
              pagination={false}
              className="approver_pdf_table"
              components={componentss}
              // bordered
            />
            <p className="fs-10 mb-15 mt-10">
              This document has been approved through the system-based workflow.
              Detailed information for CRF ID: {id} can be accessed from this
              link.{" "}
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Details
              </a>
            </p>
          </Card>
        )}

        {/* PRINT END PAGE ================================================================================================   */}

        {/*Non Printable*/}

        {/* WEB PAGE ================================================================================================   */}

        <Card style={{ minHeight: "100vh" }} id="qqq">
          <Row gutter={[24, 24]}>
            <Col lg={5} md={5} sm={24} xs={24}>
              <CreatedByComponent data={data} />
              <Button
                type="primary"
                onClick={handlePrintClick}
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  width: "100%",
                }}
              >
                Print Document
              </Button>
              {data &&
                (data.status === "Pending" || data.status === "Approved") &&
                Isadmin === true && (
                  <AddApproversComponent data={data && data} formId={formId} />
                )}
              {/*<ApproversComponent approvers={data && filteredApprovers} />*/}
              <ApproversComponent approvers={filteredApprovers} />
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
                        reloadData={getEquipmentsRequestById}
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
                        reloadData={getEquipmentsRequestById}
                        formId={formId}
                      />
                    </div>
                  )}
                </div>

                {data && data.request_title && (
                  <Badge.Ribbon text={`Grand Total ${parseFloat(data.grand_total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${crfSettingData?.data?.[0]?.crf_currency || 'PKR'}`}>
                    <Card title="Basic Information" className="mb-10">
                      <Row gutter={[16, 16]}>

                        <Col xs={24} sm={12} md={3} lg={3} xl={3}>
                          <p className="fs-12 mb-10">Sequence No</p>
                          <Tag>{data.sequence_no}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                          <p className="fs-12 mb-10">Request Title</p>
                          <Tooltip title={data.request_title} placement="top">
                            <Tag
                            style={{
                              fontSize: 'clamp(8px, 1.2vw, 12px)',
                              maxWidth: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            >{data.request_title}</Tag>
                          </Tooltip>
                        </Col>

                        <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                          <p className="fs-12 mb-10">Cost Center</p>
                          <Tag>{data.cost_center_id?.cost_center}</Tag>
                        </Col>

                        <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                          <p className="fs-12 mb-10">Location</p>
                          <Tag>{data.location?.name}</Tag>
                        </Col>
                        {data.for_employee && (
                          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                            <p className="fs-12 mb-10">For Employee</p>
                            <Tooltip title={data.for_employee} placement="top">
                            <Tag
                            style={{
                              fontSize: 'clamp(8px, 1.2vw, 12px)',
                              maxWidth: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            >{data.for_employee}</Tag>
                          </Tooltip>
                          </Col>
                        )}
                        {data.for_department && (
                          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                            <p className="fs-12 mb-10">For Department</p>
                            <Tag>{data.for_department?.name}</Tag>
                          </Col>
                        )}
                        {data && data.assigned_task?.start_at && (
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                          <p className="fs-12 mb-10 ">Start Date</p>
                          <Tag>{data.assigned_task?.start_at}</Tag>
                        </Col>
                        )}
                        {data && data.assigned_task?.due_at && (
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                          <p className="fs-12 mb-10 ">Deadline</p>
                          <Tag>{data.assigned_task?.due_at}</Tag>
                        </Col>
                        )}
                        {data.task_status?.name && (
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <p className="fs-12 mb-10 bold">Task Status</p>
                            <Tag>{data.task_status.name}</Tag>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </Badge.Ribbon>
                )}
                {data?.equipmentRequests?.length > 0 && (
                  <Card
                    title="Equipment Information"
                    className="mb-10"
                    style={{ border: "none" }}
                  >
                    {data.equipmentRequests.map((equipmentRequest, index) => (
                      <Badge.Ribbon
                        key={index}
                        text={`Equipment Request ${index + 1}`}
                      >
                        <Card>
                          <Row key={index} gutter={[16, 16]} className="mt-20">
                            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                              <p className="fs-12 mb-10">Equipment Name</p>
                              <Tag label="Equipment Name">
                                {equipmentRequest.equipment.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                              <p className="fs-12 mb-10">Quantity</p>
                              <Tag label="Quantity">{equipmentRequest.qty}</Tag>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                              <p className="fs-12 mb-10">State</p>
                              <Tag label="State">
                                {equipmentRequest.state.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                              <p className="fs-12 mb-10">Expense Type</p>
                              <Tag label="Expense Type">
                                {equipmentRequest.expense_type.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                              <p className="fs-12 mb-10">Expense Nature</p>
                              <Tag label="Expense Nature">
                                {equipmentRequest.expense_nature.name}
                              </Tag>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                              <p className="fs-12 mb-10">
                                Business Justification
                              </p>
                              <Tag label="Business Justification">
                                {equipmentRequest.business_justification}
                              </Tag>
                            </Col>

                            {editInvMode && (
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <CurrencyShowComponent data={equipmentRequest} crfSettingData = {crfSettingData} />
                            </Col>
                            )}
                            {editInvMode && (
                            <Col span={24}>
                              {equipmentRequest.asset_details &&
                                JSON.parse(equipmentRequest.asset_details).map(
                                  (assetDetail, innerIndex) => (
                                    <div key={innerIndex} className="mt-14">
                                      <Tag color="blue" className="fs-10">
                                        Equipment Inventory Asset Details{" "}
                                        {innerIndex + 1}
                                      </Tag>
                                      <Card
                                        key={innerIndex}
                                        label="Equipment Inventory Asset Details"
                                        className="mb-10"
                                      >
                                        <InventoryShowComponent
                                          key={innerIndex}
                                          assetDetail={assetDetail}
                                          currency={equipmentRequest.currency}
                                          crfSettingData = {crfSettingData}

                                        />
                                      </Card>
                                    </div>
                                  )
                                )}
                            </Col>
                            )}

                          </Row>
                        </Card>
                      </Badge.Ribbon>
                    ))}
                  </Card>
                )}

                {data &&
                  data.softwareRequests &&
                  data.softwareRequests.length > 0 && (
                    <Card title="Software Information" className="mt-20 mb-10">
                      {data.softwareRequests.map((softwareRequest, index) => (
                        <Badge.Ribbon
                          key={index}
                          text={`Software Request ${index + 1}`}
                        >
                          <Card>
                            <Row
                              key={index}
                              gutter={[16, 16]}
                              className="mt-20"
                            >
                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Software Name</p>
                                <Tag>{softwareRequest.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Software Version</p>
                                <Tag>{softwareRequest.version}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Quantity</p>
                                <Tag>{softwareRequest.qty}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Expense Type</p>
                                <Tag>{softwareRequest.expense_type.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Expense Nature</p>
                                <Tag>{softwareRequest.expense_nature.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">
                                  Business Justification
                                </p>
                                <Tag>
                                  {softwareRequest.business_justification}
                                </Tag>
                              </Col>

                              {editInvMode && (
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <CurrencyShowComponent data={softwareRequest} crfSettingData = {crfSettingData} />
                              </Col>
                              )}
                              {editInvMode && (
                              <Col span={24}>
                                {softwareRequest.asset_details &&
                                  JSON.parse(softwareRequest.asset_details).map(
                                    (assetDetail, innerIndex) => (
                                      <div key={innerIndex} className="mt-14">
                                        <Tag color="blue" className="fs-10">
                                          Software Inventory Asset Details{" "}
                                          {innerIndex + 1}
                                        </Tag>
                                        <Card
                                          key={innerIndex}
                                          label="Software Inventory Asset Details"
                                          className="mb-10"
                                        >
                                          <InventoryShowComponent
                                            key={innerIndex}
                                            assetDetail={assetDetail}
                                            currency={softwareRequest.currency}
                                            crfSettingData = {crfSettingData}

                                          />
                                        </Card>
                                      </div>
                                    )
                                  )}
                              </Col>
                              )}

                            </Row>
                          </Card>
                        </Badge.Ribbon>
                      ))}
                    </Card>
                  )}

                {data &&
                  data.serviceRequests &&
                  data.serviceRequests.length > 0 && (
                    <Card title="Service Information" className="mt-20 mb-10">
                      {data.serviceRequests.map((serviceRequest, index) => (
                        <Badge.Ribbon
                          key={index}
                          text={`Service Information ${index + 1}`}
                        >
                          <Card>
                            <Row
                              key={index}
                              gutter={[16, 16]}
                              className="mt-20"
                            >
                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Service Name</p>
                                <Tag>{serviceRequest.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">State</p>
                                <Tag>{serviceRequest.state.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Expense Type</p>
                                <Tag>{serviceRequest.expense_type.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">Expense Nature</p>
                                <Tag>{serviceRequest.expense_nature.name}</Tag>
                              </Col>

                              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                <p className="fs-12 mb-10">
                                  Business Justification
                                </p>
                                <Tag>
                                  {serviceRequest.business_justification}
                                </Tag>
                              </Col>

                              {editInvMode && (
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <CurrencyShowComponent data={serviceRequest} crfSettingData = {crfSettingData} />
                              </Col>
                              )}

                              {editInvMode && (
                              <Col span={24}>
                                {serviceRequest.asset_details &&
                                  JSON.parse(serviceRequest.asset_details).map(
                                    (assetDetail, innerIndex) => (
                                      <div key={innerIndex} className="mt-14">
                                        <Tag color="blue" className="fs-10">
                                          Service Inventory Asset Details{" "}
                                          {innerIndex + 1}
                                        </Tag>
                                        <Card
                                          key={innerIndex}
                                          label="Service Inventory Asset Details"
                                          className="mb-10"
                                        >
                                          <InventoryShowComponent
                                            key={innerIndex}
                                            assetDetail={assetDetail}
                                            currency={serviceRequest.currency}
                                            crfSettingData = {crfSettingData}

                                          />
                                        </Card>
                                      </div>
                                    )
                                  )}
                              </Col>
                              )}
                            </Row>
                          </Card>
                        </Badge.Ribbon>
                      ))}
                    </Card>
                  )}
              </div>

              <CommentSystem
                id={id}
                form_id={4}
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

export default EquipmentRequestDetails;

const styles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #qqq{
      display:none;
    }
    #ppp, #ppp * {
      visibility: visible;
    }
    #ppp {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

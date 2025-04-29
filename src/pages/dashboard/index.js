import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Badge,
  Tabs,
  Card,
  notification,
  Spin,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import DefaultLayout from "./../../components/layout/DefaultLayout";
import Header from "./../../components/header/index";
import dashboardService from "../../services/dashboard";
import approvalService from "../../services/approver";
import formService from "../../services/form";
import { useMediaQuery } from "react-responsive";
import scrfService from "../../services/scrf";
import equipmentRequestService from "../../services/equipmentRequest";

const INITIAL_FORM = 2;
const INITIAL_STATUS = "Processing";
const INITIAL_TAB = "Initiated";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [respondStatus, setRespondStatus] = useState(null);
  const [passData, setPassData] = useState(null);
  const [count, setCount] = useState("");
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formNames, setformNames] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [form, setForm] = useState(
    localStorage.getItem("form") || INITIAL_FORM.toString()
  );
  const [status, setStatus] = useState(
    localStorage.getItem("status") || INITIAL_STATUS
  );
  const [tab, setTab] = useState(localStorage.getItem("tab") || INITIAL_TAB);
  const [page, setPage] = useState(parseInt(localStorage.getItem("page")) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(localStorage.getItem("itemsPerPage")) || 15
  );

  const getForms = async () => {
    try {
      const forms = await formService.getForms();
      setformNames(forms.data);
    } catch (error) {
      console.error("Error getting forms:", error);
      return [];
    }
  };

  useEffect(() => {
    getForms();
  }, []);

  useEffect(() => {
    getPendingApprovalCounts().then(() => setLoadingData(false));
  }, []);

  useEffect(() => {
    // Save state to localStorage
    //console.log(form)
    localStorage.setItem("form", form);
    localStorage.setItem("status", status);
    localStorage.setItem("tab", tab);
    localStorage.setItem("page", page.toString());
    localStorage.setItem("itemsPerPage", itemsPerPage.toString());

    // Fetch data
    setLoadingTabs(true);
    setLoadingData(true);

    getApprovalsByFormId(page, itemsPerPage, form, tab, status).then(() =>
      setLoadingData(false)
    );
  }, [form, status, tab, page, itemsPerPage]);

  const handleDelete = (form, record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      icon: <ExclamationCircleFilled />,
      content: "This will permanently delete the record.",
      async onOk() {
        let response;
        try {
          if (form === 2) {
            response = await scrfService.deleteScrf(record.identityRecord.id);
          } else if (form === 4) {
            response = await equipmentRequestService.deleteCrf(record.id);
          }
          if (response.success) {
            notification.success({
              message: "Record Deleted",
              description: response.message,
            });
            getApprovalsByFormId(page, itemsPerPage, form, tab, status);
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.response.data.message,
          });
        }
      },
      onCancel() {
        console.log("User cancelled deletion");
      },
    });
  };

  const getPendingApprovalCounts = async () => {
    setCardLoading(true);
    try {
      const response = await dashboardService.getPendingApprovalCounts();
      setCount(response);
    } catch (error) {
      console.error("Error fetching approval counts:", error);
    } finally {
      setCardLoading(false);
    }
  };
  const getApprovalsByFormId = async (
    page,
    itemsPerPage,
    form,
    tab,
    status
  ) => {
    setLoading(true);
    try {
      setData([]);
      const response = await dashboardService.getApprovalsByFormId(
        page,
        itemsPerPage,
        form,
        tab,
        status
      );

      if (response) {
        setData(response.data);
        setPage(response.current_page);
        setTotalDataCount(response.total);
        setItemsPerPage(response.per_page);
        console.log(response);
        // console.log("CURRENT PAGE: " + response.current_page);
        // console.log("TOTAL: " + response.total);
        // console.log("PER PAGE: " + response.per_page);
        // console.log("STATUS: " + status);
        // console.log("TAB: " + tab);
        // console.log("FORM: " + form);
      }
    } catch (error) {
      console.error("Error fetching approvals:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleTableChange = (pagination) => {
    getApprovalsByFormId(pagination.current, itemsPerPage, form, tab, status);
  };

  const handleRespondStatus = async (values) => {
    setLoading(true);
    const formattedValues = {
      status: respondStatus,
      approved_disapproved: false,
      form_id: form,
      key: parseInt(passData.identityRecord.id),
      reason: values.message,
    };

    try {
      // console.log(formattedValues);
      const response = await approvalService.updateStatus(formattedValues);
      if (response.success) {
        notification.success({
          message: "Status",
          description: response.message,
        });
        getApprovalsByFormId(page, itemsPerPage, form, tab, status);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleParallelRespondStatus = async (values) => {
    setLoading(true);
    const formattedValues = {
      status: respondStatus,
      approved_disapproved: false,
      form_id: form,
      key: parseInt(passData.identityRecord.id),
      reason: values.message,
      assigned_user_id: passData.user_id,
    };
    try {
      const response = await approvalService.updateParallelStatus(
        formattedValues
      );
      if (response.success) {
        notification.success({
          message: "Status",
          description: response.message,
        });
        getApprovalsByFormId(page, itemsPerPage, form, tab, status);
      }
    } catch (error) {
      console.error("Error updating parallel status:", error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "Sequence No",
      dataIndex: ["identityRecord", "sequence_no"],
      key: "Sequence_no",
      width: 100,
    },
    {
      title: "Title",
      dataIndex: ["identityRecord", "request_title"],
      key: "request_title",
      width: 100,
    },
    // {
    //   title: 'Status',
    //   dataIndex: ['identityRecord', 'status'],
    //   key: 'status',
    //   width: 100,
    // },

    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 100,
    },

    // ...(tab === 'Approval' && status === 'Processing'
    //   ? [
    //       {
    //         title: 'Actions',
    //         dataIndex: 'actions',
    //         key: 'actions',
    //         width: 300,
    //         render: (text, record) => (
    //           <>
    //             {record.responded_by == null && (
    //               <ActionsApprovalColumn
    //       handleStatus={handleRespondStatus}
    //       setRespondStatus={setRespondStatus}
    //       setPassData={setPassData}
    //       record={record}
    //     />
    //             )}
    //           </>
    //         ),
    //       },
    //     ]
    //   : []),
    // ...(tab === 'Parallel' && status === 'Processing'
    //   ? [
    //       {
    //         title: 'Actions',
    //         dataIndex: 'actions',
    //         key: 'actions',
    //         width: 300,
    //         render: (text, record) => (
    //           <>
    //             {record.responded_by == null && (

    //               <ActionsApprovalColumn
    //               handleStatus={handleParallelRespondStatus}
    //               setRespondStatus={setRespondStatus}
    //               setPassData={setPassData}
    //               record={record}
    //             />
    //             )}
    //           </>
    //         ),
    //       },
    //     ]
    //   : []),
    // ...(status === 'Approved' || status === 'Disapproved' || status === 'Return'
    //   ? [
    //       {
    //         title: 'Actions',
    //         dataIndex: 'actions',
    //         key: 'actions',
    //         width: 100,
    //         render: (text, record) => (
    //           <>
    //             {status === 'Approved' || status === 'Disapproved' || status === 'Return' &&  (
    //               <Tag color={'#52c41a'}>Reason: {record.reason}</Tag>
    //             )}

    //           </>
    //         ),
    //       },
    //     ]
    //   : []),
    ...(tab === "Initiated" && status === "Processing"
      ? [
          // {
          //   title: 'Assigned To',
          //   dataIndex: ['user', 'name'],
          //   key: ['user', 'name'],
          //   width: 100,
          // },
          // {
          //   title: 'Responded By',
          //   dataIndex: ['responded_by', 'name'],
          //   key: ['responded_by', 'name'],
          //   width: 100,
          // },
        ]
      : []),

    {
      title: "View",
      dataIndex: "view",
      key: "view",
      width: 100,
      render: (text, record) => (
        <>
          {form == 1 && (
            <>
              <Link
                to={`/quality-assurance/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/quality-assurance/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}

          {form == 2 && (
            <>
              <Link
                to={`/scrf/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/scrf/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}

          {form == 4 && (
            <>
              <Link
                to={`/crf/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/crf/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}

          {form == 5 && (
            <>
              <Link
                to={`/mobile-requisition/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/mobile-requisition/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}

          {form == 6 && (
            <>
              <Link
                to={`/master-data-management-form/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/master-data-management-form/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}
          {form == 3 && (
            <>
              <Link
                to={`/deployment/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/deployment/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}

          {form == 7 && (
            <>
              <Link
                to={`/sap-access-form/details/${
                  record.identityRecord && record.identityRecord.id
                }`}
              >
                <EyeOutlined className="mr-4" />
              </Link>

              {((record.draft_at !== null && record.draft_at !== undefined) ||
                record.status === "Return") && (
                <Link
                  to={`/sap-access-form/edit/${
                    record.identityRecord && record.identityRecord.id
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <EditOutlined className="mr-4" />
                </Link>
              )}

              {record.draft_at !== null ||
                (record.draft_at !== undefined && (
                  <Link style={{ cursor: "pointer" }}>
                    <DeleteOutlined
                      className="mr-4"
                      onClick={() => handleDelete(form, record)}
                    />
                  </Link>
                ))}
            </>
          )}
        </>
      ),
    },
  ];

  const handleFormsChange = (key) => {
    setForm(key);
    // setStatus('Processing');
    setTab("Approval");
  };

  const handleTabsChange = (key) => {
    setLoadingTabs(true);
    setLoadingData(true);
    setTab(key);
    // setStatus('Processing');
    setData([]);
    getApprovalsByFormId(page, itemsPerPage, form, key, status)
      .then(() => setLoadingTabs(false))
      .finally(() => setLoadingData(false));
  };

  const handleStatusChange = (key) => {
    setLoadingTabs(true);
    setLoadingData(true);
    setStatus(key);
    setData([]);
    getApprovalsByFormId(page, itemsPerPage, form, tab, key)
      .then(() => setLoadingTabs(false))
      .finally(() => setLoadingData(false));
  };
  const renderFormsTabs = () => {
    return (
      <Tabs
        tabPosition={isMobile ? "top" : "left"}
        className="dashboardFirstLevel"
        onChange={handleFormsChange}
        activeKey={form}
      >
        {formNames.map((formType, index) => (
          <Tabs.TabPane
            key={formType.id || index}
            tab={<span>{formType.name.toUpperCase()}</span>}
          >
            <Tabs
              defaultActiveKey="Initiated"
              className="tabs"
              activeKey={tab}
              onChange={handleTabsChange}
            >
              <Tabs.TabPane tab="Initiated" key="Initiated">
                {renderApprovalStatusTabs(formType.name)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Approvals" key="Approval">
                {renderApprovalStatusTabs(formType.name)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Parallel Approvers" key="Parallel">
                {renderApprovalStatusTabs(formType.name)}
              </Tabs.TabPane>
            </Tabs>
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  };

  const ApprovalStatusTabs = ({
    status,
    totalDataCount,
    data,
    handleStatusChange,
    handleTableChange,
    columns,
    page,
    itemsPerPage,
    setPage,
  }) => {
    const tabs = [
      { key: "Processing", label: "Processing" },
      { key: "Approved", label: "Approved" },
      { key: "Disapproved", label: "Disapproved" },
      { key: "Return", label: "Return" },
    ];

    return (
      <Tabs
        defaultActiveKey="Processing"
        onChange={handleStatusChange}
        style={{ height: "100%" }}
        activeKey={status}
      >
        {tabs.map((tab) => (
          <Tabs.TabPane
            tab={
              <span>
                {tab.label}{" "}
                {status === tab.key && totalDataCount > 0 ? (
                  <Badge count={totalDataCount} />
                ) : null}
              </span>
            }
            key={tab.key}
          >
            <Table
              dataSource={
                data && data.map((item, index) => ({ ...item, key: index }))
              }
              onChange={handleTableChange}
              columns={columns}
              rowKey={(record) => record.key}
              scroll={{ x: 1000 }}
              pagination={{
                current: page,
                total: totalDataCount,
                pageSize: itemsPerPage,
                showSizeChanger: false,
                onChange: (current) => setPage(current),
              }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  };

  const renderApprovalStatusTabs = (category) => {
    return (
      <ApprovalStatusTabs
        status={status}
        totalDataCount={totalDataCount}
        data={data}
        handleStatusChange={handleStatusChange}
        handleTableChange={handleTableChange}
        columns={columns}
        page={page}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
      />
    );
  };

  return (
    <DefaultLayout>
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Header icon={<TeamOutlined />} title="Dashboard" />
          </Col>
        </Row>
        <Row gutter={[10, 10]} className="pt-20 pb-20">
          <Col lg={6} md={6} sm={24} xs={24}>
            <Spin spinning={cardLoading}>
              <Card style={{ backgroundColor: "#2d77fa", color: "#fff" }}>
                <p>Approved</p>
                <h2>{count.approved_count}</h2>
              </Card>
            </Spin>
          </Col>
          <Col lg={6} md={6} sm={24} xs={24}>
            <Spin spinning={cardLoading}>
              <Card style={{ backgroundColor: "#4cbb17", color: "#fff" }}>
                <p>Disapproved</p>
                <h2>{count.disapproved_count}</h2>
              </Card>
            </Spin>
          </Col>
          <Col lg={6} md={6} sm={24} xs={24}>
            <Spin spinning={cardLoading}>
              <Card style={{ backgroundColor: "#4a2c8f", color: "#fff" }}>
                <p>Processing/Pending</p>
                <h2>{count.processing_count}</h2>
              </Card>
            </Spin>
          </Col>

          <Col lg={6} md={6} sm={24} xs={24}>
            <Spin spinning={cardLoading}>
              <Card style={{ backgroundColor: "#8f4a2c", color: "#fff" }}>
                <p>Return</p>
                <h2>{count.return_count}</h2>
              </Card>
            </Spin>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Spin size="large" spinning={loadingData}>
              {renderFormsTabs()}
            </Spin>
          </Col>
        </Row>
      </Card>
    </DefaultLayout>
  );
}

export default Dashboard;

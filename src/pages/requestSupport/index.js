import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  notification,
  Card,
  Button,
  Select,
  Dropdown,
  Menu,
  Modal,
  Input,
  Empty,
} from "antd";
import {
  TeamOutlined,
  EyeOutlined,
  CommentOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import { Excel } from "antd-table-saveas-excel";
import commentService from "../../services/comment";
import formService from "../../services/form";
import TaskDetailsComponent from "../../components/taskDetails";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import { useMediaQuery } from "react-responsive";
import locationService from "./../../services/location";
import UserComponent from "./../../components/user";
import FormListComponent from "./../../components/serviceDeskFormList";
import taskService from "../../services/tasks";
import qaService from "../../services/qualityAssurance";
import departmentService from "../../services/department";
import styles from "./index.css";
const RequestServiceDesk = () => {
  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();
  const [selectedForm, setSelectedForm] = useState(99);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [isUATModalVisible, setIsUATModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isSendQaModalVisible, setIsSendQaModalVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  // const [formVisible, setFormVisible] = useState(false);
  const [taskId, setTaskId] = useState(false);
  const [edit, setEdit] = useState(true);
  const [formData, setFormData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [departments, setDepartments] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const getDepartments = async () => {
    const response = await departmentService.getAllDepartments();
    setDepartments(response);
  };

  const getTaskStatus = async () => {
    const response = await taskService.getTaskStatus();
    setTaskStatus(response.data);
  };

  const handleSendQa = async (values) => {
    try {
      setLoading(true);
      const response = await qaService.sendQaRequest(
        selectedForm,
        currentKey,
        values.users
      );
      setLoading(false);
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
        });
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
      form.resetFields();
      setIsSendQaModalVisible(false);
    } catch (error) {
      console.error("Error sending QA request:", error);
      setLoading(false);
      notification.error({
        message: "Error",
        description:
          error.response.data.message ||
          "There was an error sending the QA request.",
      });
    }
  };

  const getLocations = async () => {
    const response = await locationService.getAllLocations();
    setLocations(response);
  };

  useEffect(() => {
    getLocations();
    getTaskStatus();
    getDepartments();
  }, []);

  useEffect(() => {
    // const savedForm = localStorage.getItem("selectedForm");
    const savedForm = selectedForm;
    if (savedForm) {
      setSelectedForm(JSON.parse(savedForm));
    } else {
      setSelectedForm(selectedForm);
    }
  }, []);

  const onSearch = async (values) => {
    values.form_id = selectedForm;
    setLoading(true);
    try {
      const response = await formService.supportDesksearch(selectedForm, values);
      setData(response.data);
      // setCurrentPage(response.current_page);
      // setTotalDataCount(response.total);
      // setItemsPerPage(response.per_page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error while searching:", error);
    }
  };
  const handleSortChange = (pagination, filters, sorter) => {
    setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    setSortBy(sorter.field);

    serviceDesk(selectedForm, page, itemsPerPage, sortBy, sortOrder);
  };
  // const toggleFormVisibility = () => {
  //   setFormVisible(!formVisible);
  // };

  const onFinishUAT = (values) => {
    // console.log(currentKey, selectedForm);
  };

  const ActionsDropdown = ({ record }) => {
    //console.log(record)
    const handleMenuClick = async (e) => {
      setCurrentKey(record.id);
      setCurrentLocation(record.location.name);
      switch (e.key) {
        case "1":
          break;
        case "2":
          openTaskModal(record);
          break;
        case "3":
          const data = {
            non_form_id: 1,
            key: record.id,
            status: record.comment_status === 0 ? 1 : 0,
          };
          handleComment(data);
          //openUATModal();
          break;
        case "4":
          const QaData = {
            form_id: selectedForm,
            key: record.id,
            users: "",
          };
          openSendQaRequest(QaData);
          break;
        default:
          break;
      }
    };

    const handleComment = async (data) => {
      try {
        const response = await commentService.updateCommentStatusNonForm(data);
        if (response.success) {
          await serviceDesk(selectedForm, currentPage, itemsPerPage);
          notification.success({
            message: "Updated",
            description: response.message,
          });
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: error.response.data.message,
        });
      } finally {
        setLoading(false);
      }
    };

    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<EyeOutlined />}>
            <Link to={`/support-desk-form/details/${record.id}`}>View</Link>
          
        </Menu.Item>
       {/* {record.task_assigned_at === null && (
          <Menu.Item key="2" icon={<TeamOutlined />}>
            Assign Task
          </Menu.Item>
        )}*/}
        <Menu.Item key="3" icon={<CommentOutlined />}>
          Comment {record.comment_status ? "Closed" : "Open"}{" "}
        </Menu.Item>

       {/* {(record.task_status?.name !== "Closed" ||
          record.task_status?.name !== "Rejected & Closed") && (
          <Menu.Item key="4" icon={<TeamOutlined />}>
            Send QA Request
          </Menu.Item>
        )}*/}

        {/* <Menu.Item key="3" icon={<CommentOutlined />}>
          UAT/Feedback Request
        </Menu.Item>
        <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>Deployment Request</Menu.Item> */}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <MenuOutlined />
        </a>
      </Dropdown>
    );
  };

  // const serviceDesk = async (form, page, itemsPerPage) => {
  //   try {
  //     setLoading(true);
  //     const response = await formService.serviceDesk(form, page, itemsPerPage);
  //     //console.log(response)
  //     setLoading(false);
  //     setData(response.data);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  const handleTableChange = (pagination, filters, sorter) => {
    // console.log('testttt ',pagination, filters, sorter);
    setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    setSortBy(sorter.field);

    serviceDesk(
      selectedForm,
      pagination.current,
      pagination.pageSize,
      sortBy,
      sortOrder
    );
  };

  const handleFormChange = (selectedValue) => {
    setSelectedForm(selectedForm);
    localStorage.setItem("selectedForm", selectedForm);
    console.log('selectedValue');
    console.log(selectedValue);
  };

  const serviceDesk = async (
    form,
    page,
    itemsPerPage,
    sortBy = "id",
    sortOrder = "desc"
  ) => {
    try {
      setLoading(true);
      const response = await formService.supportServiceDesk(
        form,
        page,
        itemsPerPage,
        sortBy,
        sortOrder
      );

      console.log(response)

      setLoading(false);
      setData(response.data);
      return response;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      // Handle error, display message to the user
      notification.error({
        message: "Error",
        description: "There was a problem fetching data from the server.",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await serviceDesk(selectedForm, 1, 15, sortBy, sortOrder);
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedForm, sortBy, sortOrder]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      width: 40,
    },
    {
      title: "Sequence No",
      dataIndex: "sequence_no",
      key: "sequence_no",
      width: 120,
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      sorter: true,
    },
    {
      title: "Request Title",
      dataIndex: "request_title",
      key: "request_title",
      // width: 160,
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      sorter: true,
    },
    // {
    //   title: 'Software Category',
    //   dataIndex: ['software_category', 'name'],
    //   key: 'software_category',
    //   width: 170,
    //   sorter: true,
    // },
    // {
    //   title: 'Subcategory',
    //   dataIndex: ['software_subcategories', 'name'],
    //   key: 'software_subcategories',
    //   width: 170,
    //   sorter: true,
    //   render: (text, record) => record.software_subcategories.map((subcategory) => subcategory.name).join(', '),
    // },
    {
      title: "Location",
      dataIndex: ["location", "name"],
      key: "location",
      // width: 120,
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      // width: 120,
      sorter: true,
    },
    {
      title: "Task Initiated At",
      dataIndex: "task_initiated_at",
      key: "task_initiated_at",
      // width: 200,
      sorter: true,
    },
    {
      title: "Task Assigned At",
      dataIndex: "task_assigned_at",
      key: "task_assigned_at",
      // width: 200,
      sorter: true,
      // sorter: (a, b) => {
      //   const dateA = moment(a.task_assigned_at);
      //   const dateB = moment(b.task_assigned_at);
      //   return dateA - dateB;
      // },
    },
    {
      title: "Task Approval At",
      dataIndex: "task_approval_at",
      key: "task_approval_at",
      // width: 180,
      // sorter: (a, b) => {
      //   const dateA = new Date(a.task_approval_at);
      //   const dateB = new Date(b.task_approval_at);
      //   return dateA - dateB;
      // },
    },
    {
      title: "Task Status",
      dataIndex: ["task_status", "name"],
      key: ["task_status", "name"],
      // width: 180,
      sorter: true,
      // sorter: (a, b) => a.task_status.name.localeCompare(b.task_status.name),
    },
    {
      title: "Approval Status",
      dataIndex: "status",
      key: "status",
      // width: 180,
      // sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Task Assigned Teams",
      dataIndex: "task_assigned_teams",
      key: "task_assigned_teams",
      width: 400,
      render: (teams) => {
        if (!teams || teams.length === 0) return "";

        const teamInfo = teams.map((team) => {
          const teamName = team.team.name;
          const managers = team.managers
            .map((manager) => manager.name)
            .join(", ");
          const members = team.members.map((member) => member.name).join(", ");

          return `${teamName} (Managers: ${managers}, Members: ${members})`;
        });

        return teamInfo.join("; ");
      },
      sorter: (a, b) => {
        const teamsA = (a.task_assigned_teams || [])
          .map((team) => team.team.name)
          .join(", ");
        const teamsB = (b.task_assigned_teams || [])
          .map((team) => team.team.name)
          .join(", ");
        return teamsA.localeCompare(teamsB);
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: useMediaQuery({ minWidth: 768 }) ? "right" : null,
      render: (text, record) => <ActionsDropdown record={record} />,
    },
  ];

  const handleClick = () => {
    const excelColumns = columns.filter((column) => column.key !== "actions");

    const excel = new Excel();
    excel
      .addSheet("data")
      .addColumns(excelColumns)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };

  const openUATModal = () => {
    setIsUATModalVisible(true);
  };

  const closeUATModal = () => {
    setIsUATModalVisible(false);
  };

  const openTaskModal = (record) => {
    form.resetFields();
    setFormData(record);
    setTaskId(record.id);
    setIsTaskModalVisible(true);

    const hasMembers =
      Array.isArray(record.task_assigned_teams) &&
      record.task_assigned_teams.some(
        (team) =>
          team.members && Array.isArray(team.members) && team.members.length > 0
      );
    setEdit(hasMembers);
  };

  const closeTaskModal = async () => {
    setIsTaskModalVisible(false);
    if (selectedForm !== null) {
      await serviceDesk(selectedForm, page, itemsPerPage);
    }
  };

  const openSendQaRequest = (record) => {
    setFormData(record);
    setTaskId(record.id);
    setIsSendQaModalVisible(true);

    const hasMembers =
      Array.isArray(record.task_assigned_teams) &&
      record.task_assigned_teams.some(
        (team) =>
          team.members && Array.isArray(team.members) && team.members.length > 0
      );
    setEdit(hasMembers);
  };

  const closeSendQaModal = async () => {
    form.resetFields();
    setIsSendQaModalVisible(false);
    if (selectedForm !== null) {
      await serviceDesk(selectedForm, page, itemsPerPage);
    }
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<TeamOutlined />}
            title="Service Desk"
            right={
              <>
                <Button onClick={handleClick} className="mt-10 mb-10 mr-10">
                  Export
                </Button>
              </>
            }
          />
        </Col>
      </Row>

{/*      {!loading && (
        <Card>
          <FormListComponent
            onChange={handleFormChange}
            selectedFormId={selectedForm}
          />
        </Card>
      )}*/}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={searchForm} onFinish={onSearch} layout="vertical">
              <Card className="pt-6" style={{ paddingBottom: "0 !important" }}>
                <Row gutter={[12, 12]}>
                  <Col lg={4} md={5} sm={6} xs={12}>
                    <Form.Item name="sequence_no">
                      <Input size="large" placeholder="Sequence No" />
                    </Form.Item>
                  </Col>

                  <Col lg={7} md={8} sm={9} xs={12}>
                    <Form.Item name="request_title">
                      <Input size="large" placeholder="Request Title" />
                    </Form.Item>
                  </Col>

                  <Col lg={4} md={5} sm={6} xs={12}>
                    <Form.Item name={["department_id"]}>
                      <Select
                        showSearch={true}
                        optionFilterProp="children"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Please Select Department"
                        allowClear
                      >
                        {departments &&
                          departments.map((department) => (
                            <Select.Option
                              key={department.id}
                              value={department.id}
                            >
                              {department.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col lg={4} md={5} sm={6} xs={12}>
                    <Form.Item name={["location_id"]}>
                      <Select
                        showSearch={true}
                        optionFilterProp="children"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Please Select Location"
                        allowClear
                      >
                        {locations &&
                          locations.map((loc) => (
                            <Select.Option key={loc.id} value={loc.id}>
                              {loc.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col lg={4} md={5} sm={6} xs={12}>
                    <Form.Item name="task_status">
                      <Select
                        showSearch={true}
                        optionFilterProp="children"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Please Select Task Status"
                        allowClear
                      >
                        {taskStatus &&
                          taskStatus.map((task) => (
                            <Select.Option key={task.id} value={task.id}>
                              {task.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col lg={4} md={5} sm={6} xs={12}>
                    <Button
                      block
                      className="btn-blue"
                      htmlType="submit"
                      type="primary"
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            {data.length > 0 ? (
              <Table
                rowKey="id"
                style={{ minHeight: "100vh" }}
                virtual
                scroll={{ x: 2000, y: 1000 }}
                sticky={true}
                columns={columns}
                onChange={handleTableChange}
                dataSource={data}
                pagination={false}
                // pagination={{
                //   total: totalDataCount,
                //   current: currentPage,
                //   pageSize: itemsPerPage,
                // }}
                loading={loading}
                rowClassName={(record) => {
                  return record.task_assigned_at !== null
                    ? "task-assigned-row"
                    : "";
                }}
              />
            ) : (
              <Empty description="No record found." />
            )}
          </Card>
        </Col>
      </Row>
      <>
        <Modal
          title="UAT/Feedback Request"
          open={isUATModalVisible}
          onCancel={closeUATModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinishUAT}>
            <Form.Item
              name="name"
              label="Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="user_id"
              label="User"
              rules={[{ required: true, message: "Please select user" }]}
            >
              <UserComponent />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Assign Task To Team/Members"
          open={isTaskModalVisible}
          onCancel={closeTaskModal}
          footer={null}
          size="xl"
        >
          <TaskDetailsComponent
            selectedForm={selectedForm}
            taskId={taskId}
            onTaskFinished={closeTaskModal}
            editData={edit}
            formData={formData}
          />
        </Modal>

        <Modal
          title="Send QA Request"
          open={isSendQaModalVisible}
          onCancel={closeSendQaModal}
          footer={null}
        >
          <Form form={form} onFinish={handleSendQa}>
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form.Item
                  name="users"
                  rules={[{ required: true, message: "Please Select User" }]}
                >
                  <UserComponent mode="multiple" />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" htmlType="submit" loading={loading}>
              Send Request
            </Button>
          </Form>
        </Modal>
      </>
    </DefaultLayout>
  );
};

export default RequestServiceDesk;

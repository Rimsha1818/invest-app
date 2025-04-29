import React, { useState, useEffect } from "react";

import {
  Form,
  Select,
  Button,
  Input,
  Row,
  Col,
  Table,
  Card,
  Spin,
  notification,
  Modal,
  Tag,
  Space,
  Tooltip,
  Badge,
} from "antd";
import {
  ProfileOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import FormService from "../../services/form";
import workflowService from "../../services/workflow";
import approverService from "../../services/approver";
import subscriberService from "../../services/subscriber";

import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import UpdateDynamicFormModal from "../../components/workflow/updateWorkflow";
import conditionService from "../../services/conditions";
import { useMediaQuery } from "react-responsive";
import DynamicFields from "../../components/DynamicFields";
import FormListComponent from "./../../components/workflowEditFormList/index";
import UserComponent from "./../../components/user/index";

import { useLocation } from "react-router-dom";

const { Option } = Select;

const WorkFlow = () => {
  const columns = [
    {
      title: "Approvers",
      dataIndex: ["approver_name"],
      key: "name",
      width: 140,
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      sorter: (a, b) => a.form.name.localeCompare(b.form.name),
    },
    {
      title: "Users",
      dataIndex: ["users"], // Reference the `approvers` array
      key: "name",
      width: 200,
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      sorter: (a, b) => a.users.length - b.users.length, // Example sorter based on users count
      render: (users) => (
        <div>
          {users.map((user, index) => (
            <span className="mr-10" key={`avatar-${user.id}-${index}`}>
              <Badge
                count={`${user.name} | ${user.status}`}
                color="blue"
                style={{
                  padding: "3px 10px",
                  height: "auto",
                  marginBottom: "10px",
                  boxShadow: "0px 0px 9px -3px black",
                }}
              />
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Sequence No",
      dataIndex: ["sequence_no"],
      key: "name",
      width: 140,
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      sorter: (a, b) => a.form.name.localeCompare(b.form.name),
    },

    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <Space>
          {record.users.every((user) => user.status === "Pending") && (
            <div
              onClick={() => handleDelete(record)}
              style={{ cursor: "pointer" }}
            >
              <DeleteOutlined />
            </div>
          )}
          {/*<div onClick={() => openUpdateModal(record)} style={{ cursor: 'pointer' }}>
            <EditOutlined />
          </div>*/}
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedApprovers, setSelectedApprovers] = useState({});
  const [selectedSubscribers, setSelectedSubscribers] = useState({});

  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [formDetails, setFormDetails] = useState(null);
  const [workflowId, setWorkflowId] = useState(null);

  const [formDetailStatus, setFormDetailStatus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentApproversData, setCurrentApproversData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [initiatorFieldOneOptions, setInitiatorFieldOneOptions] = useState();
  const [initiatorFieldTwoOptions, setInitiatorFieldTwoOptions] = useState();
  const [initiatorFieldThreeOptions, setInitiatorFieldThreeOptions] =
    useState();
  const [initiatorFieldFourOptions, setInitiatorFieldFourOptions] = useState();
  const [initiatorFieldFiveOptions, setInitiatorFieldFiveOptions] = useState();

  const [initiatorFieldOneLabel, setInitiatorFieldOneLabel] = useState();
  const [initiatorFieldTwoLabel, setInitiatorFieldTwoLabel] = useState();
  const [initiatorFieldThreeLabel, setInitiatorFieldThreeLabel] = useState();
  const [initiatorFieldFourLabel, setInitiatorFieldFourLabel] = useState();
  const [initiatorFieldFiveLabel, setInitiatorFieldFiveLabel] = useState();

  const [formName, setFormName] = useState(0);
  const [selectedForm, setSlectedForm] = useState(0);

  const [conditions, setConditions] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [conditionUpdate, setConditionUpdate] = useState(true);

  const [dataWf, setDataWf] = useState([]);
  const [worlflowId, setWorlflowId] = useState([]);

  const location = useLocation();
  const { form_id, key } = location.state || {}; // Destructure the data

  const getFilteredApprovers = (id) => {
    const selectedIds = Object.values(selectedApprovers).filter(
      (_, key) => key !== id
    );
    return approvers.filter((approver) => !selectedIds.includes(approver.id));
  };

  const getFilteredSubscribers = (id) => {
    const selectedIds = Object.values(selectedSubscribers).filter(
      (_, key) => key !== id
    );
    return subscribers.filter(
      (subscriber) => !selectedIds.includes(subscriber.id)
    );
  };

  const handleApproverChange = (value, id) => {
    setSelectedApprovers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const openUpdateModal = (record) => {
    setWorkflowId(record.id);
    setCurrentApproversData(record.approvers_subscribers);
    setUpdateModalVisible(true);
    setSlectedForm(record.form.id);
  };

  const closeUpdateModal = () => {
    setUpdateModalVisible(false);
  };

  const getConditions = async () => {
    try {
      const response = await conditionService.getConditions();
      const mergedConditionSCRF = [
        ...response[0].form.conditions,
        ...response[1].form.conditions,
      ];
      const mergedConditionCRF = [
        ...response[0].form.conditions,
        ...response[2].form.conditions,
      ];

      if (formName == 2) {
        setConditions(response[1].form.conditions);
        // setConditions(mergedConditionSCRF);
      } else if (formName == 4) {
        setConditions(response[2].form.conditions);
        // setConditions(mergedConditionCRF);
      } else {
        // setConditions(response[0].form.conditions);
        setConditions([]);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response,
      });
    }
  };

  useEffect(() => {
    getConditions();
  }, [formName, conditionUpdate]);

  const handleUpdate = async (values) => {
    console.log("values below for update");
    console.log(values);
    setLoading(true);

    const formattedData = new FormData();
    formattedData.append("workflow_id", worlflowId);
    formattedData.append("form_id", form_id);
    formattedData.append("key", key);
    formattedData.append("callback", "default");

    values.workflowSubscribersApprovers.forEach((approver, index) => {
      formattedData.append(
        `approverSubscribers[${index}][approver_id]`,
        approver.approver_id
      );

      formattedData.append(
        `approverSubscribers[${index}][subscriber_id]`,
        approver.subscriber_id ?? ""
      );
      // formattedData.append(
      //   `approverSubscribers[${index}][subscriber_id]`,
      //   approver.subscriber_id
      // );
      formattedData.append(
        `approverSubscribers[${index}][approval_condition]`,
        approver.approval_condition ?? ""
      );
      formattedData.append(
        `approverSubscribers[${index}][sequence_no]`,
        approver.sequence_no
      );
      formattedData.append(
        `approverSubscribers[${index}][editable]`,
        approver.editable
      );
    });

    try {
      const response = await workflowService.updateWorkflowApprovers(
        formattedData
      );
      if (response) {
        setLoading(false);
        setModalVisible(false);
        form.resetFields();
        notification.success({
          message: "Updated",
          description: "Updated Successfully",
        });
        getCurrentWorkflow(form_id, key);

        // getWorkflows(currentPage)
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      console.log(error.response);
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    getConditions();

    setConditionUpdate(true);
    setUpdateModalVisible(true);
    // setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getSubscribers = async () => {
    setLoading(true);
    await subscriberService.getSubscribers().then((response) => {
      setSubscribers(response);
      setLoading(false);
    });
  };

  const getApprovers = async () => {
    setLoading(true);
    try {
      const response = await approverService.getAllApprovers();
      setApprovers(response);
      setLoading(false);
    } catch (error) {}
  };

  const handleDelete = (record) => {
    console.log(record.approver_id);
    console.log(form_id);
    console.log(key);
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the Workflow?`,
      onOk: async () => {
        setLoading(true);
        try {
          const formattedDataDelete = new FormData();
          formattedDataDelete.append("form_id", form_id);
          formattedDataDelete.append("key", key);
          formattedDataDelete.append("approver_id", record.approver_id);

          const response = await workflowService.deleteWorkflowGroup(
            formattedDataDelete
          );
          if (response.success) {
            notification.success({
              message: "Approver Group Deleted",
              description: response.message,
            });
            getCurrentWorkflow(form_id, key);
          }
        } catch (error) {
          notification.error({
            message: "Error In Deleting Group",
            description: error.response.data.message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSubscriberChange = (value, id) => {
    setSelectedSubscribers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    getApprovers();
    getSubscribers();
    getWorkflows();
    addField();
    getCurrentWorkflow(form_id, key);

    setSlectedForm(key);
    setFormName(key);
    getFormDetails(form_id);
  }, []);

  useEffect(() => {
    form.setFieldsValue(formDetails);
  }, [formDetails]);

  const getFormDetails = async (id) => {
    setInitiatorFieldOneOptions("");
    setInitiatorFieldOneLabel("");
    setInitiatorFieldTwoOptions("");
    setInitiatorFieldTwoLabel("");
    setInitiatorFieldThreeOptions("");
    setInitiatorFieldThreeLabel("");
    setInitiatorFieldFourOptions("");
    setInitiatorFieldFourLabel("");
    setInitiatorFieldFiveOptions("");
    setInitiatorFieldFiveLabel("");

    setFormLoading(true);
    try {
      const response = await FormService.getFormDetails(id);
      //console.log(response)
      if (response) {
        response.forEach((field, index) => {
          switch (index) {
            case 0:
              setInitiatorFieldOneOptions(field.list);
              setInitiatorFieldOneLabel(field.name);
              break;
            case 1:
              setInitiatorFieldTwoOptions(field.list);
              setInitiatorFieldTwoLabel(field.name);
              break;
            case 2:
              setInitiatorFieldThreeOptions(field.list);
              setInitiatorFieldThreeLabel(field.name);
              break;
            case 3:
              setInitiatorFieldFourOptions(field.list);
              setInitiatorFieldFourLabel(field.name);
              break;
            case 4:
              setInitiatorFieldFiveOptions(field.list);
              setInitiatorFieldFiveLabel(field.name);
              break;
            default:
              break;
          }
        });
        setFormLoading(false);
        setFormDetailStatus(true);
      }
    } catch (error) {
      setFormLoading(false);
      setFormDetailStatus(false);
    }
  };

  const handleFormTypeChange = async (value) => {
    //console.log(value)
    setSlectedForm(2);
    setFormName(2);
    getFormDetails(2);
  };

  const addField = () => {
    const newField = {
      id: fields.length,
      approver: "",
      subscriber: "",
      approvalCondition: "",
      sequenceNo: "",
    };

    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
  };

  const getWorkflows = async (page = 1) => {
    setLoading(true);
    try {
      const response = await workflowService.getWorkflows();
      //console.log(response)
      if (response) {
        setData(response.data);
        setCurrentPage(page);
        setTotalDataCount(response.total);
        setItemsPerPage(response.per_page);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // zee
  const getCurrentWorkflow = async (formId = 2, key = 173) => {
    // console.log("yes here")
    // console.log(formId)
    // console.log(key)
    // setLoading(true);

    try {
      const response = await workflowService.getCurrentWorkflow(formId, key);
      if (response) {
        // console.log("current wf response",response[0].approvers)

        setDataWf(response[0].approvers);
        setWorlflowId(response[0].workflow_id);
        // setTotalDataCount(response.total);
        // setItemsPerPage(response.per_page);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // zee

  const onFinish = async (values) => {
    // console.log(values)
    setLoading(true);
    try {
      const response = await workflowService.postWorkflow(values);
      if (response.success) {
        setLoading(false);
        setModalVisible(false);
        form.resetFields();
        notification.success({
          message: "Workflow Added",
          description: response.message,
        });
        getWorkflows(currentPage);
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // const expandedRowRender = (records) => {
  //   const expandedData = records.approvers_subscribers.map((record, index) => ({
  //    key: index.toString(),
  //   subscriber: record.subscriber?.name,
  //    sequenceNo: record.sequence_no,
  //    approvalCondition: record.approval_condition?.name,
  //    approver: record.approver?.name,
  // }));

  // const expandedColumns = [
  //   {
  //     title: 'Approver',
  //     dataIndex: 'approver',
  //     key: 'approver',
  //     // fixed: 'left'
  //   },
  //   {
  //     title: 'Sequence No',
  //     dataIndex: 'sequenceNo',
  //     key: 'sequenceNo',
  //   },
  //   {
  //     title: 'Approval Condition',
  //     dataIndex: 'approvalCondition',
  //     key: 'approvalCondition',
  //   },
  //   {
  //     title: 'Subscriber',
  //     dataIndex: 'subscriber',
  //     key: 'subscriber',
  //   },

  // ];

  //   return (
  //     <Table
  //       style={{borderLeft: '2px solid #1599fd'}}
  //       columns={expandedColumns}
  //       pagination={false}
  //       dataSource={expandedData.map((item, index) => ({ ...item, key: `expanded_${item.id}_${index}` }))}
  //       rowKey={(record) => record.key}
  //       />
  //   );
  // };

  // console.log(`selectedForm${selectedForm}`);
  // console.log(currentApproversData);
  // console.log('approvers');
  // console.log(approvers);
  // console.log('dataWf');
  // console.log(dataWf);

  const datawfIds = dataWf.map((item) => item.approver_id);
  const filteredApprovers = approvers.filter(
    (approver) => !datawfIds.includes(approver.id)
  );

  console.log("dataWf");
  console.log(dataWf);
  return (
    <DefaultLayout>
      <UpdateDynamicFormModal
        visible={updateModalVisible}
        onCancel={closeUpdateModal}
        onUpdate={handleUpdate}
        approvers={filteredApprovers}
        subscribers={subscribers}
        currentApproversData={currentApproversData}
        selectedForm={form_id}
        add_manage_wf={true}
      />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<ProfileOutlined />}
            title="Workflow"
            right={
              <Button type="primary" onClick={openModal}>
                Update Workflow
              </Button>
            }
          />
        </Col>
      </Row>

      <Modal
        title="Workflow Form"
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={1300}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[24, 24]}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="form_id"
                label="Form Type"
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <FormListComponent
                  onChange={handleFormTypeChange}
                  selectedFormId={2}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="initiator_id"
                label="Select Initiator"
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <UserComponent mode="multiple" />
              </Form.Item>
            </Col>
          </Row>

          <Spin
            style={{ width: "100%", justifyContent: "center" }}
            spinning={formLoading}
          >
            {formDetailStatus && (
              <Card size="small" title="Please Select Your Initiator Values">
                <Row gutter={[24, 24]}>
                  {initiatorFieldOneLabel && initiatorFieldOneOptions && (
                    <Col lg={4} md={4} sm={24} xs={24}>
                      <Form.Item
                        name="key_one"
                        label={initiatorFieldOneLabel}
                        rules={[
                          {
                            required: true,
                            message: "Please select an option",
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          optionFilterProp="children"
                          size="large"
                        >
                          {initiatorFieldOneOptions.map((option) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}

                  {initiatorFieldTwoLabel && initiatorFieldTwoOptions && (
                    <Col lg={4} md={4} sm={24} xs={24}>
                      <Form.Item
                        name="key_two"
                        label={initiatorFieldTwoLabel}
                        rules={[
                          {
                            required: true,
                            message: "Please select an option",
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          optionFilterProp="children"
                          size="large"
                        >
                          {initiatorFieldTwoOptions.map((option) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}

                  {initiatorFieldThreeLabel && initiatorFieldThreeOptions && (
                    <Col lg={4} md={4} sm={24} xs={24}>
                      <Form.Item
                        name="key_three"
                        label={initiatorFieldThreeLabel}
                        rules={[
                          {
                            required: true,
                            message: "Please select an option",
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          optionFilterProp="children"
                          size="large"
                        >
                          {initiatorFieldThreeOptions.map((option) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}

                  {initiatorFieldFourLabel && initiatorFieldFourOptions && (
                    <Col lg={4} md={4} sm={24} xs={24}>
                      <Form.Item
                        name="key_four"
                        label={initiatorFieldFourLabel}
                        rules={[
                          {
                            required: true,
                            message: "Please select an option",
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          optionFilterProp="children"
                          size="large"
                        >
                          {initiatorFieldFourOptions.map((option) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}

                  {initiatorFieldFiveLabel && initiatorFieldFiveOptions && (
                    <Col lg={4} md={4} sm={24} xs={24}>
                      <Form.Item
                        name="key_five"
                        label={initiatorFieldFiveLabel}
                        rules={[
                          {
                            required: true,
                            message: "Please select an option",
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          optionFilterProp="children"
                          size="large"
                        >
                          {initiatorFieldFiveOptions.map((option) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  <Col lg={4} md={4} sm={24} xs={24}>
                    <Form.Item
                      name="callback"
                      label="Callback URL"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your feedback",
                        },
                      ]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <DynamicFields
                  fields={fields}
                  setFields={setFields}
                  approvers={approvers}
                  subscribers={subscribers}
                  conditions={conditions}
                  handleApproverChange={handleApproverChange}
                  handleSubscriberChange={handleSubscriberChange}
                  getFilteredApprovers={getFilteredApprovers}
                  getFilteredSubscribers={getFilteredSubscribers}
                  selectedForm={selectedForm}
                />

                <Row className="mt-20">
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Add Workflow
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )}
          </Spin>
        </Form>
      </Modal>

      <Card>
        <Table
          // sticky={{top: 0}}
          loading={loading}
          style={{ minHeight: "100vh" }}
          scroll={{ x: 1500 }}
          columns={columns}
          dataSource={dataWf.map((item) => ({ ...item, key: item.id }))}
          rowKey={(record) => record.key}
          pagination={true}
          // expandable={{
          //   expandedRowRender,
          //   onExpand: (expanded, record) => {
          //     if (expanded) {
          //       setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
          //     } else {
          //       setExpandedRowKeys((prevKeys) => prevKeys.filter((key) => key !== record.key));
          //     }
          //   },
          // }}
        />
      </Card>
    </DefaultLayout>
  );
};

export default WorkFlow;

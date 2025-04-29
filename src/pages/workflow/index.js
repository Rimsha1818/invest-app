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

import callbackService from "../../services/callback";

import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import UpdateDynamicFormModal from "../../components/workflow/updateWorkflow";
import conditionService from "../../services/conditions";
import { useMediaQuery } from "react-responsive";
import DynamicFields from "../../components/DynamicFields";
import FormListComponent from "./../../components/formList/index";
import UserComponent from "./../../components/user/index";

const { Option } = Select;

const WorkFlow = () => {
  const columns = [
    {
      title: "Form Type",
      dataIndex: ["form", "name"],
      key: "name",
      width: 140,
      fixed: useMediaQuery({ minWidth: 768 }) ? "left" : null,
      sorter: (a, b) => a.form.name.localeCompare(b.form.name),
    },
    {
      title: "Initiator",
      dataIndex: ["workflow_initiator", "name"],
      key: "workflow_initiator",
      width: 180,
      render: (text, record) =>
        record.workflow_initiator ? (
          <Tag>{record.workflow_initiator.name}</Tag>
        ) : null,
      sorter: (a, b) =>
        a.workflow_initiator.name.localeCompare(b.workflow_initiator.name),
    },
    {
      title: "Initiator Field One",
      dataIndex: ["key_one", "name"],
      key: "key_one",
      width: 220,
      sorter: (a, b) =>
        a.key_one && a.key_one.name
          ? a.key_one.name.localeCompare(b.key_one?.name)
          : 0,
    },
    {
      title: "Initiator Field Two",
      dataIndex: ["key_two", "name"],
      key: "key_two",
      width: 220,
      sorter: (a, b) =>
        a.key_two && a.key_two.name
          ? a.key_two.name.localeCompare(b.key_two?.name)
          : 0,
    },
    {
      title: "Initiator Field Three",
      dataIndex: ["key_three", "name"],
      key: "key_three",
      width: 220,
      sorter: (a, b) =>
        a.key_three && a.key_three.name
          ? a.key_three.name.localeCompare(b.key_three?.name)
          : 0,
    },
    {
      title: "Initiator Field Four",
      dataIndex: ["key_four", "name"],
      key: "key_four",
      width: 250,
      sorter: (a, b) =>
        a.key_four && a.key_four.name
          ? a.key_four.name.localeCompare(b.key_four?.name)
          : 0,
    },
    {
      title: "Initiator Field Five",
      dataIndex: ["key_five", "name"],
      key: "key_five",
      width: 220,
      sorter: (a, b) =>
        a.key_five && a.key_five.name
          ? a.key_five.name.localeCompare(b.key_five?.name)
          : 0,
    },
    {
      title: "Callback URL",
      dataIndex: "callback_id",
      key: "callback",
      width: 220,
      sorter: (a, b) => a.callback.localeCompare(b.callback),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <Space>
          <div
            onClick={() => handleDelete(record)}
            style={{ cursor: "pointer" }}
          >
            <DeleteOutlined />
          </div>
          <div
            onClick={() => openUpdateModal(record)}
            style={{ cursor: "pointer" }}
          >
            <EditOutlined />
          </div>
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

  const [callbacksData, setCallbacksData] = useState();


  const getFilteredApprovers = (id) => {
    const selectedIds = Object.values(selectedApprovers).filter(
      (_, key) => key !== id
    );
    return approvers.filter((approver) => !selectedIds.includes(approver.id));
  };

  // const getFilteredSubscribers = (id) => {
  //   const selectedIds = Object.values(selectedSubscribers).filter(
  //     (_, key) => key !== id
  //   );
  //   return subscribers.filter(
  //     (subscriber) => !selectedIds.includes(subscriber.id)
  //   );
  // };

  const getFilteredSubscribers = (id) => {
    const selectedIds = Object.entries(selectedSubscribers)
      .filter(([key]) => key !== String(id)) // Ensure key is treated as string
      .map(([, value]) => value); // Extract selected values

    return subscribers.filter((subscriber) => !selectedIds.includes(subscriber.id));
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
        // setConditions(response[0].form.conditions)
        setConditions(mergedConditionSCRF);
      } else if (formName == 4) {
        setConditions(mergedConditionCRF);
      } else {
        setConditions(response[0].form.conditions);
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
  }, [formName]);

  const handleUpdate = async (values) => {
    console.log(values)
    
    const updatedValues = {
        ...values,
        workflowSubscribersApprovers: values.workflowSubscribersApprovers.map(approver => ({
            ...approver,
            sequence_no: Number(approver.sequence_no), // Ensure integer conversion
        }))
    };

    console.log("Updated Values Before Submission:", updatedValues); // Debugging log


    setLoading(true);
    try {
      const response = await workflowService.updateWorkflow(workflowId, updatedValues);
      if (response) {
        setLoading(false);
        setModalVisible(false);
        form.resetFields();
        notification.success({
          message: "Updated",
          description: "Updated Successfully",
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

  const openModal = () => {
    setModalVisible(true);
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

  const getCallbacks = async () => {
    setLoading(true);
    try {
      const response = await callbackService.getCallbacks();
      setCallbacksData(response.data);
      setLoading(false);
    } catch (error) {}
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the Workflow?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await workflowService.deleteWorkflow(record.id);
          if (response.success) {
            notification.success({
              message: "Workflow Deleted",
              description: response.message,
            });
            getWorkflows(currentPage);
          }
        } catch (error) {
          notification.error({
            message: "Error",
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
    getCallbacks();
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
    setSlectedForm(value);
    setFormName(value);
    getFormDetails(value);
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

  const onFinish = async (values) => {
    console.log(values);

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

  const expandedRowRender = (records) => {
    const expandedData = records.approvers_subscribers.map((record, index) => ({
      key: index.toString(),
      subscriber: record.subscriber?.name,
      sequenceNo: record.sequence_no,
      approvalCondition: record.approval_condition?.name,
      approver: record.approver?.name,
    }));

    const expandedColumns = [
      {
        title: "Approver",
        dataIndex: "approver",
        key: "approver",
        // fixed: 'left'
      },
      {
        title: "Sequence No",
        dataIndex: "sequenceNo",
        key: "sequenceNo",
      },
      {
        title: "Approval Condition",
        dataIndex: "approvalCondition",
        key: "approvalCondition",
      },
      {
        title: "Subscriber",
        dataIndex: "subscriber",
        key: "subscriber",
      },
    ];

    return (
      <Table
        style={{ borderLeft: "2px solid #1599fd" }}
        columns={expandedColumns}
        pagination={false}
        dataSource={expandedData.map((item, index) => ({
          ...item,
          key: `expanded_${item.id}_${index}`,
        }))}
        rowKey={(record) => record.key}
      />
    );
  };

  return (
    <DefaultLayout>
      <UpdateDynamicFormModal
        visible={updateModalVisible}
        onCancel={closeUpdateModal}
        onUpdate={handleUpdate}
        approvers={approvers}
        subscribers={subscribers}
        currentApproversData={currentApproversData}
        selectedForm={selectedForm}
      />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<ProfileOutlined />}
            title="Workflow"
            right={
              <Button type="primary" onClick={openModal}>
                Add Workflow
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
                <FormListComponent onChange={handleFormTypeChange} />
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
                      name="callback_id"
                      label="Callback URL"
                      initialValue=" "
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please enter your feedback",
                      //   },
                      // ]}
                    >
                      <Select
                        showSearch={true}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        size="large"
                        // value={selectedValue} 
                        allowClear
                        onChange={(value) => {
                          form.setFieldsValue({
                            callback_id: value ?? "", // Set to empty string when cleared
                          });
                        }}
                      >
                          {callbacksData && callbacksData.map((option) => (
                            <Select.Option key={option.id} value={option.id}>
                              {option.name}
                            </Select.Option>
                          ))}
                      </Select>

                      {/*<Input size="large" />*/}
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
                        Create Workflow
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
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          rowKey={(record) => record.key}
          pagination={true}
          expandable={{
            expandedRowRender,
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
              } else {
                setExpandedRowKeys((prevKeys) =>
                  prevKeys.filter((key) => key !== record.key)
                );
              }
            },
          }}
        />
      </Card>
    </DefaultLayout>
  );
};

export default WorkFlow;

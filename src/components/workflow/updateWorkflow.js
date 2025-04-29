import React, { useState, useEffect } from "react";
import { Modal, Form, notification, Button, Spin } from "antd";
import conditionService from "../../services/conditions";
import DynamicFields from "./../DynamicFields/index";

const UpdateDynamicFormModal = ({
  visible,
  onCancel,
  onUpdate,
  approvers,
  subscribers,
  currentApproversData,
  selectedForm,
  add_manage_wf,
}) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState("");
  const [selectedApprovers, setSelectedApprovers] = useState({});
  const [selectedSubscribers, setSelectedSubscribers] = useState({});

  useEffect(() => {
    const initialFields = currentApproversData.map((data, index) => ({
      id: index,
      approver_id: data.approver?.id,
      subscriber_id: data.subscriber?.id,
      approval_condition: data.approval_condition?.id,
      sequence_no: data.sequence_no,
      editable: data.editable,
    }));
    setFields(initialFields);

    form.setFieldsValue({
      workflowSubscribersApprovers: initialFields,
    });

    const initialSelectedApprovers = {};
    const initialSelectedSubscribers = {};
    initialFields.forEach((field) => {
      if (field.approver_id) {
        initialSelectedApprovers[field.id] = field.approver_id;
      }
      if (field.subscriber_id) {
        initialSelectedSubscribers[field.id] = field.subscriber_id;
      }
    });
    setSelectedApprovers(initialSelectedApprovers);
    setSelectedSubscribers(initialSelectedSubscribers);
  }, [currentApproversData]);

  const onFinish = (values) => {
    const filteredWorkflowSubscribersApprovers =
      values.workflowSubscribersApprovers.filter(
        (field) => field !== undefined
      );
    const filteredFields = filteredWorkflowSubscribersApprovers.filter(
      (field) =>
        field.approver_id !== "" &&
        field.subscriber_id !== "" &&
        field.approval_condition !== "" &&
        field.sequence_no !== "" &&
        field.editable !== ""
    );
    onUpdate({ ...values, workflowSubscribersApprovers: filteredFields });
    onCancel();
  };

  const handleApproverChange = (value, id) => {
    setSelectedApprovers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubscriberChange = (value, id) => {
    console.log("Selected Value:", value, "Row ID:", id+1);
    setSelectedSubscribers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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
  // const getConditions = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await conditionService.getConditions();
  //     setLoading(false);
  //     if (selectedForm === 2) {
  //       setConditions(response[0].form.conditions);
  //     } else if (selectedForm === 4) {
  //       setConditions(response[1].form.conditions);
  //     } else {
  //       setConditions(response[0].form.conditions);
  //     }
  //   } catch (error) {
  //     notification.error({
  //       message: 'Error',
  //       description: error.response,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   getConditions();
  // }, [selectedForm]);

  return (
    <Modal
      title="Update Approvers or Subscribers"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1300}
    >
      <Spin spinning={loading}>
        <Form form={form} onFinish={onFinish} layout="vertical">
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
            add_manage_wf={add_manage_wf}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdateDynamicFormModal;

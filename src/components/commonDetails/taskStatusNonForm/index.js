import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, notification, Select } from "antd";

import taskService from "../../../services/tasks";
import { Navigate, useNavigate } from "react-router-dom";

function TaskStatus({ data, reloadData, formId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState([]);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState([]);
  const navigate = useNavigate();

  const getTaskStatus = async (page = 1) => {
    setLoading(true);
    await taskService.getTaskStatus().then((response) => {
      setTaskStatus(response.data);
      if(data?.task_status?.id)
      {

        const defaultStatus = response.data.find(
          (option) => option.id === data.task_status.id
        );

        // Set selectedTaskStatus if a match is found
        if (defaultStatus) {
          setSelectedTaskStatus(defaultStatus.id);
          form.setFieldsValue({
            status: defaultStatus.id,
          });
        }
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getTaskStatus();
  }, []);

  const onFinish = async (values) => {
    console.log("data:", formId); // Add this line
    setLoading(true);
    const formattedValues = {
      non_form_id: formId,
      task_id: data.assigned_task.id,
      status: values.status,
    };
    try {
      const response = await taskService.updateTaskStatusNonForm(formattedValues);
      if (response.success) {
        notification.success({
          message: "Status Updated",
          description: response.message,
        });
        reloadData();
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      // notification.error({
      //   message: 'Error',
      //   description: error.response.data.message
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ padding: "0", marginBottom: "4px" }}>
      <Form form={form} onFinish={onFinish} layout="vertical" className="mt-30">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please select the status",
                },
              ]}
            >
              {console.log("check11 ", selectedTaskStatus)}
              <Select
                placeholder="Select Status"
                value={selectedTaskStatus}
              >
                {taskStatus.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Respond to status
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default TaskStatus;

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, notification, Select, DatePicker } from "antd";

import taskService from "../../../services/tasks";
import { Navigate, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

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
        console.log(data)
        console.log('asdasd')
      if(data?.task_status?.id)
      {

        const defaultStatus = response.data.find(
          (option) => option.id === data.task_status.id
        );

        // Set selectedTaskStatus if a match is found
//         const teams = data.assigned_task?.assign_task_teams;
// const lastTeam = teams?.at(-1);
// const lastMember = lastTeam?.members?.at(-1);
        if (defaultStatus) {
          setSelectedTaskStatus(defaultStatus.id);
          form.setFieldsValue({
            status: defaultStatus.id,
            start_at: dayjs(data.assigned_task?.assign_task_teams[0]?.members[0]?.start_at),
            due_at: dayjs(data.assigned_task?.assign_task_teams[0]?.members[0]?.due_at),
            team_id: data.assigned_task?.assign_task_teams[0]?.team?.id,
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
      form_id: formId,
      task_id: data.assigned_task.id,
      status: values.status,
      start_at: values.start_at?.format('YYYY-MM-DD HH:mm:ss'),
      due_at: values.due_at?.format('YYYY-MM-DD HH:mm:ss'),
      team_id: values.team_id,
    };
    try {
      const response = await taskService.updateTaskStatus(formattedValues);
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
        <Row gutter={[24, 24]}>
          <Col xs={6} sm={6} md={6} lg={6} xl={6}>
            <Form.Item
              label="Status"
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
                size="large"

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
          {/* Start At */}
          <Col span={6}>
            <Form.Item
              label="Start At"
              name='start_at'
              rules={[{ required: true, message: 'Please select start date & time' }]}
            >
              <DatePicker
                showTime
                format={dateFormat}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </Col>

          {/* Due At */}
          <Col span={6}>
            <Form.Item
              label="End At"
              name='due_at'
              rules={[{ required: true, message: 'Please select due date & time' }]}
            >
              <DatePicker
                showTime
                format={dateFormat}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6}>
            <Form.Item
              label="Team"
              name="team_id"
              rules={[{ required: true, message: "Please select a team" }]}
            >
              <Select size="large" placeholder="Select Team">
                {data?.assigned_task?.assign_task_teams?.map((item) => (
                  <Select.Option key={item.team.id} value={item.team.id}>
                    {item.team.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="mt-20" size="large">
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

import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Row,
  Col,
  Select,
  Card,
  notification,
  Badge,
  Spin,
  Space,
  DatePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons'; // <-- Correct import
import teamGroupService from '../../services/teamGroup';
import taskService from '../../services/tasks';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const TaskDetailsComponent = ({
  selectedForm,
  taskId,
  onTaskFinished,
  editData,
  formData,
}) => {
  const [form] = Form.useForm();
  const [teamGroups, setTeamGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskTeams, setTaskTeams] = useState([
    { team_id: null, team_members: [], membersData: [] }, 
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const taskResponse = await teamGroupService.getFormGroup(selectedForm);
        setTeamGroups(taskResponse);

        if (editData && formData && formData.task_assigned) {
          const membersResponse = await taskService.getExistingMembers(
            formData.task_assigned.id
          );

          const initialTaskTeams = membersResponse.assigned_task_team.map(
            (team) => ({
              team_id: team.team.id,
              team_members: team.members.map((member) => member.id),
              membersData: team.members, // Store the fetched members
            })
          );
          setTaskTeams(initialTaskTeams);
          form.setFieldsValue({ team_ids: initialTaskTeams });
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedForm, editData, formData, form]);

  const handleTeamChange = async (index, value) => {
    try {
      setLoading(true);

      // Update team_id in taskTeams
      setTaskTeams((prevTeams) =>
        prevTeams.map((team, i) =>
          i === index ? { ...team, team_id: value } : team
        )
      );

      // Fetch team members from server
      const response = await teamGroupService.getGroupTeamMembers(value);
      const membersData = response.members || []; // Assuming response has a 'members' array

      // Update the membersData for the selected team group
      setTaskTeams((prevTeams) =>
        prevTeams.map((team, i) =>
          i === index ? { ...team, membersData } : team
        )
      );

      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setLoading(false);
    }
  };

  const handleTeamMembersChange = (index, value) => {
    setTaskTeams((prevTeams) =>
      prevTeams.map((team, i) =>
        i === index ? { ...team, team_members: value } : team
      )
    );
  };

  const addTeamGroup = () => {
    setTaskTeams((prevTeams) => [
      ...prevTeams,
      { team_id: null, team_members: [] },
    ]);
  };

  const removeTeamGroup = (index) => {
    setTaskTeams((prevTeams) => prevTeams.filter((_, i) => i !== index));
  };

  const onFinish = async (values) => {
    const updatedValues = {
      ...values,
      form_id: selectedForm,
      key: taskId,
      start_at: values.start_at?.format('YYYY-MM-DD HH:mm:ss'),
      due_at: values.due_at?.format('YYYY-MM-DD HH:mm:ss'),

      team_ids: values.team_ids.map((team) => ({
        team_id: team.team_id,
        team_members: Array.isArray(team.team_members)? team.team_members : [],
      })),
    };
    setLoading(true);
    try {
      if (editData) {
        console.log('here1')
        const response = await taskService.updateTask(
          formData.task_assigned.id,
          updatedValues
        );
        if (response.success) {
          notification.success({
            message: 'Task Updated',
            description: 'Task Updated Successfully',
          });
          // form.resetFields(); // Consider when to reset
        }
      } else {
        console.log('here2')
        console.log(updatedValues)

        const response = await taskService.postTask(updatedValues);
        if (response.success) {
          notification.success({
            message: 'Task Added',
            description: 'Task Added Successfully',
          });
        }
      }
      onTaskFinished();
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTaskTeams = () => {
    return taskTeams.map((team, index) => (

      <>
      <Card key={index} size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]}>
        {/* Start At */}
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              label="Due At"
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
        </Row>
      </Card>
      <Card key={index} size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]}>
          {/* Team Group Selection */}
          <Col span={24}>
            <Form.Item
              label="Team Groups"
              name={['team_ids', index, 'team_id']}
              rules={[{ required: true, message: 'Please select a team group' }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                size="large"
                onChange={(value) => handleTeamChange(index, value)}
              >
                {teamGroups.map((group) => (
                  <Option key={group.id} value={group.id}>
                    {group.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Team Members Selection */}
          <Col span={24}>
            <Form.Item
              label="Team Members"
              name={['team_ids', index, 'team_members']}
              rules={[{ required: true, message: 'Please select team members' }]}
            >
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                size="large"
                onChange={(value) => handleTeamMembersChange(index, value)}
              >
                {team.membersData?.map((member) => (
                  <Option key={member.id} value={member.id}>
                    {member.name} - {member.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          

          {index > 0 && (
            <Col span={24}>
              <Button onClick={() => removeTeamGroup(index)}>
                Remove Team Group
              </Button>
            </Col>
          )}
        </Row>
      </Card>
      </>
    ));
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} onFinish={onFinish} layout="vertical" className="mt-20">
        {renderTaskTeams()}
        <Space style={{ width: '100%' }} className="mb-20">
          <Button icon={<PlusOutlined />} onClick={addTeamGroup}>
            Add More Team Groups
          </Button>
        </Space>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editData ? 'Save Changes' : 'Add Task'}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default TaskDetailsComponent;
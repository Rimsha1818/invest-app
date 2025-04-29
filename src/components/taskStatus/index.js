import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import taskService from '../../services/tasks';

export default function TaskStatusComponent({ onChange, value, all }) {
  const [taskStatus, setTaskStatus] = useState([]);

  const getTaskStatus = async () => {
    const response = await taskService.getTaskStatus()
    setTaskStatus(response.data);
  };

  useEffect(() => {
    getTaskStatus();
  }, []);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Task Status"
      value={value}
      onChange={onChange}
      allowClear
    >
      {taskStatus &&
        taskStatus.map((task) => (
          <Select.Option key={task.id} value={task.id}>
            {task.name}
          </Select.Option>
        ))}
    </Select>
  );
}

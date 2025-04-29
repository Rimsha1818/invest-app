import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import formService from '../../services/form';

export default function TaskComponent({ onChange, value, id, selectedKey, ...props }) {
  const [tasks, setTasks] = useState(null);
  const getTasksList = async () => {
    const response = await formService.getServiceDeskAllTask(id);
    setTasks(response.data);
  };

  useEffect(() => {
    if(id !== null || id !== undefined || id !== 0) {
      getTasksList();
    }
  }, [id]);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Task"
      value={(selectedKey !== undefined || selectedKey !== null) ? selectedKey : value} 
      onChange={onChange}
      allowClear
      {...props}
    >
      {tasks &&
        tasks.map((task) => (
          <Select.Option key={task.id} value={task.id}>
            {task.request_title}
          </Select.Option>
        ))}
    </Select>
  );
}

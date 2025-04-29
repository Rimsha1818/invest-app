import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import userService from '../../services/user';

export default function UserComponent({ onChange, value, all, employee_no, selectedUsers, multiselect = false, forMR = false, ...props }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState([]);

  const getUsers = async () => {
    setLoading(true);
    let response;
    if (all) {
      response = await userService.getAllUsers();
    } else {
      response = await userService.getUsers();
    }
    setUsers(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!loading) {
      setSelectedValue(selectedUsers ?? value);
    }
  }, [loading, selectedUsers, value]);

  const handleChange = (newValue) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  return (
    <Spin spinning={loading}>
    <Select
      showSearch
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      value={selectedValue}
      onChange={handleChange}
      placeholder='Select User'
      allowClear
      {...props}
    >
      {users &&
        users.map((user) => (
          <Select.Option key={user.id} value={user.id}>
            {forMR ? `${user.name} - ${user.employee_no}` : `${user.name} - ${user.email}`}
          </Select.Option>
        ))}
    </Select>
    </Spin>
  );
}
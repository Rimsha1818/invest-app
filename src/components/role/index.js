import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import roleService from '../../services/role'; 

export default function RoleComponent({ onChange, value, all, ...props }) {
  const [roles, setRoles] = useState(null);

  const getRoles = async () => {
    const response = await roleService.getRoles();
    setRoles(response);
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Role"
      value={value}
      onChange={onChange}
      allowClear
      {...props}
    >
      {roles &&
        roles.map((role) => (
          <Select.Option key={role.id} value={role.id}>
            {role.name}
          </Select.Option>
        ))}
    </Select>
  );
}

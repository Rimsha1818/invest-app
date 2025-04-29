import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
import projectService from '../../services/project';

export default function LocationComponent({ onChange, value, all, form_id }) {

  const [projects, setProjects] = useState([]);

  const getAllProjectsByForm = async () => {
    let response;
    if (all === true) {
      response = await projectService.getAllProjectsByForm(form_id);
    } else {
      response = await projectService.getAllProjectsByForm(form_id);
    }
    setProjects(response);
  };

  useEffect(() => {
    getAllProjectsByForm();
  }, [all, form_id]);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Location"
      value={value}
      onChange={onChange}
      allowClear
    >
      {projects &&
        projects.map((proj) => (
          <Select.Option key={proj.id} value={proj.id}>
            {proj.name}
          </Select.Option>
        ))}
    </Select>
  );
}

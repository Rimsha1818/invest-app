import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import formService from '../../services/form'; 

export default function FormListComponent({ onChange, value, selectedFormId, ...props }) {
  const [forms, setForms] = useState(null);
  const [selectedValue, setSelectedValue] = useState([]);
  const [loading, setLoading] = useState(true);
  //console.log(selectedFormId)
  const fetchData = async () => {
    setLoading(true);
    const response = await formService.getForms();
    setLoading(false);
    setForms(response.data);
  };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setSelectedValue(selectedFormId ?? value);
    }
  }, [loading, selectedFormId, value]);

  const handleChange = (newValue) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  return (
    <Spin spinning={loading}>
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      value={selectedValue} 
      onChange={handleChange}
      allowClear
      {...props}
    >
      {forms &&
        forms 
        // .filter((option) => option.id !== 1)
        .map((option) => (
          <Select.Option key={option.id} value={option.id}>
            {option.name}
          </Select.Option>
        ))}
    </Select>
    </Spin>
  );
}
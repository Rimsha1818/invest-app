import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';

export default function SapLocationComponent({ onChange, value, all }) {
  const locationOptions = [
    { id: 1, name: "Head Office" },
    { id: 2, name: "Karachi Plant" },
    { id: 3, name: "Pezu Plant" },
    { id: 4, name: "Area Office" },
    { id: 5, name: "Islamabad" },
    { id: 6, name: "Lahore" },
    { id: 7, name: "Peshawar" },
    { id: 8, name: "Multan" },
    { id: 9, name: "Faisalabad" },
    { id: 10, name: "Quetta" },
];
  return (
    <Select
      mode="multiple"
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Location"
      value={value}
      onChange={onChange}
      allowClear
    >
      {locationOptions.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
}

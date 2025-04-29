import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';

export default function SapPlantComponent({ onChange, value, all }) {
  const plantOptions = [
  { id: 1, name: "PIBT" },
  { id: 2, name: "QICT" },
  { id: 3, name: "LCHO" },
  { id: 4, name: "LCKP" },
  { id: 5, name: "LCPZ" },
  { id: 6, name: "LKPT" },
  { id: 7, name: "PKGP" },
  { id: 8, name: "PGPZ" },
];

  return (
  <Select
    mode="multiple"
    showSearch={true}
    optionFilterProp="children"
    style={{ width: '100%' }}
    size="large"
    placeholder="Please Select Plant"
    value={value}
    onChange={onChange}
   
    allowClear
  >
    {plantOptions.map((option) => (
      <Select.Option key={option.id} value={option.id}>
        {option.name}
      </Select.Option>
    ))}
  </Select>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';

export default function SapTypeComponent({ onChange, value, all }) {

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Type"
      value={value}
      onChange={onChange}
      allowClear
    >
      <Select.Option key="New" value="New">
        New
      </Select.Option>
      <Select.Option key="Modification" value="Modification">
        Modification
      </Select.Option>
      
    </Select>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';

export default function SdfPriorityComponent({ onChange, value, all }) {

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Priority"
      value={value}
      onChange={onChange}
      allowClear
    >
      <Select.Option key="Low" value="Low">
        Low
      </Select.Option>
      <Select.Option key="Medium" value="Medium">
        Medium
      </Select.Option>
      <Select.Option key="High" value="High">
        High
      </Select.Option>
      
    </Select>
  );
}

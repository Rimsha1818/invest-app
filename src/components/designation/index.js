import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import designationService from '../../services/designation'; 

export default function DesignationComponent({ onChange, value, all }) {

  const [designations, setDesignations] = useState(null);

  const getDesignations = async () => {
    let response;
    if (all === true) {
      response = await designationService.getAllDesignations();
    } else {
      response = await designationService.getDesignations();
    }
    setDesignations(response);
  };

  useEffect(() => {
    getDesignations();
  }, []);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Designation"
      value={value}
      onChange={onChange}
      allowClear
    >
      {designations &&
        designations.map((designation) => (
          <Select.Option key={designation.id} value={designation.id}>
            {designation.name}
          </Select.Option>
        ))}
    </Select>
  );
}

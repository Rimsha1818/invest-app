import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
import costCenterService from '../../services/costCenter';

export default function CostCenterComponent({ onChange, value, all, related, fixed }) {

  const [costCenters, setCostCenters] = useState([]);

  const getCostCenters = async () => {
    let response;
    if (all === true) {
        response = await costCenterService.getAllCostCenters();
    }
    else if (related === true) {
      response = await costCenterService.getRelatedCostCenters();
    }
    else {
      response = await costCenterService.getAllCostCenters();
    }
    
    setCostCenters(response);
  };

  const filteredCostCenters = fixed
    ? costCenters.filter((loc) => loc.id === value) // Show only the selected cost center
    : costCenters; // Show all if fixed is false
    
  useEffect(() => {
    getCostCenters();
  }, [all]);


  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Cost Center"
      value={value}
      onChange={onChange}
      allowClear
    >
      {filteredCostCenters &&
        filteredCostCenters.map((loc) => (
          <Select.Option key={loc.id} value={loc.id}>
            {loc.cost_center}
          </Select.Option>
        ))}
    </Select>
  );
}

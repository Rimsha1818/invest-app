import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
import locationService from '../../services/location';

export default function LocationComponent({ onChange, value, all }) {

  const [locations, setLocations] = useState([]);

  const getLocations = async () => {
    let response;
    if (all === true) {
      response = await locationService.getAllLocations();
    } else {
      response = await locationService.getLocations();
    }
    setLocations(response);
  };

  useEffect(() => {
    getLocations();
  }, [all]);

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
      {locations &&
        locations.map((loc) => (
          <Select.Option key={loc.id} value={loc.id}>
            {loc.name}
          </Select.Option>
        ))}
    </Select>
  );
}

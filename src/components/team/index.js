import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
import serviceService from "../../services/service";

export default function ServiceComponent({ onChange, value, all, multi, datas, byDep }) {
  const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();

  const getTeams = async (page = 1) => {
    await serviceService.getTeams(page).then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
    });
  };

  useEffect(() => {
      if(!byDep){
        getTeams();
      }
  }, []);

   useEffect(() => {
    if (byDep) {
      setData(datas); 
    }
  }, [datas]);  

  return (
    <Select
      mode={multi ? 'multiple' : undefined}
      // mode="multiple"
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Location"
      value={value}
      onChange={onChange}
      allowClear
    >
       {(data && Array.isArray(data) ? data : []).map((option) => (
          <Select.Option key={option.id} value={option.id}>
            {option.name}
          </Select.Option>
        ))}
    </Select>
  );
}

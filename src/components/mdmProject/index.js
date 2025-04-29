import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
import mdmProjectService from "../../services/mdmProject";

export default function MdmProjectComponent({ onChange, value, all, related, fixed, categoryId, mdmCategoryId}) {

  const [mdmProject, setMdmProject] = useState([]);

  const getMdmProject = async () => {
    let response;
    console.log('yes hits');

   if( categoryId === null || mdmCategoryId === null ){
      console.log('yes here');
      response = [];
   }else{
      console.log('yes here2');
      response = await mdmProjectService.getAllMdmProjects(categoryId, mdmCategoryId);
   }
    setMdmProject(response);
  };

  // const filteredCostCenters = fixed
  //   ? costCenters.filter((loc) => loc.id === value) // Show only the selected cost center
  //   : costCenters; // Show all if fixed is false
    
  useEffect(() => {
    getMdmProject();
  }, [categoryId, mdmCategoryId]);


  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Project"
      value={value}
      onChange={onChange}
      allowClear
    >
      {mdmProject &&
        mdmProject.map((mdmProj) => (
          <Select.Option key={mdmProj.id} value={mdmProj.id}>
            {mdmProj.name}
          </Select.Option>
        ))}
    </Select>
  );
}

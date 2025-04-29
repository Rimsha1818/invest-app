import React, { useState, useEffect } from 'react';
import { Select, Spin, notification } from 'antd';
import conditionService from '../../services/conditions';

const { Option } = Select;

const ConditionSelect = ({ selectedForm, value, onChange, add_manage_wf }) => {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getConditions = async () => {
      try {
        setLoading(true);
        const response = await conditionService.getConditions();
        setLoading(false);

        // console.log('inside internal component',selectedForm)
        // console.log('inside internal component',response)
        // console.log('inside internal component',response[0].form.conditions)
        // console.log('inside internal component',response[1].form.conditions)
        let mergedConditionSCRF = "";
        let mergedConditionCRF = "";
        if(add_manage_wf){
          mergedConditionSCRF = [
              // ...response[0].form.conditions, 
              ...response[1].form.conditions
          ];
          mergedConditionCRF = [
              // ...response[0].form.conditions, 
              ...response[2].form.conditions
          ];
        }
        else{
          mergedConditionSCRF = [
              ...response[0].form.conditions, 
              ...response[1].form.conditions
          ];
          mergedConditionCRF = [
              ...response[0].form.conditions, 
              ...response[2].form.conditions
          ];
        }
    
        if (selectedForm === 2) {
          setConditions(mergedConditionSCRF);
        } else if (selectedForm === 4) {
          setConditions(mergedConditionCRF);
        }
        else {
          if(add_manage_wf){
            setConditions([]);
          }else{
            setConditions(response[0].form.conditions);
          }
        }
      } catch (error) {
        setLoading(false);
        notification.error({
          message: 'Error',
          description: error.response,
        });
      }
    };

    getConditions();
  }, [selectedForm]);

  return (
    <Spin spinning={loading}>
      <Select
        showSearch
        optionFilterProp="children"
        size="large"
        allowClear
        value={value}
        onChange={onChange}
      >
     {(selectedForm != 0) && <>
      {conditions.map((condition) => (
          <Option key={condition.id} value={condition.id}>{condition.name}</Option>
        ))}
     </>}

      </Select>
    </Spin>
  );
};

export default ConditionSelect;

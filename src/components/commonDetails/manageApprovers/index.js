import {  Card, Button  } from 'antd'
import React from 'react'
import { WarningOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function AddApproversComponent({data, formId}) {
const navigate = useNavigate();
  
  console.log('data this is')
  console.log(data.id)
  console.log(formId)
  // Data to pass
  // const formId = formId; // Example form_id
  // const formType = 'Type A'; // Example form_type

  return (
    <Card className="mt-20">
      <div className=" fs-12-c text-center">
        <Button
          type="primary"
          onClick={() => navigate('/workflow-edit', { state: { form_id: formId, key: data.id } })}
          className=""
        >
          Add/Manage Approvers
        </Button>
      </div>
    </Card>

  );
}

export default AddApproversComponent
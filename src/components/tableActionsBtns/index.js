import React, { useState, useEffect } from "react";
// import React from 'react';
import { Space, Button, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Link, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

// FORMS SERVICES
import qaService from '../../services/qualityAssurance';
import csrfService from "../../services/scrf";
import deploymentService from "../../services/deployment";
import equipmentRequestService from "../../services/equipmentRequest";
import mobileRequisitionService from "../../services/mobileRequisition";

import mdmService from "../../services/mdm";

const TableActionBtnsComponent = ({ record, handleDelete, formId }) => {
  const { currentUser } = useSelector((state) => state.user);

  // Check if the record is valid before accessing properties


  // const isCurrentUserApprover = record.approvers.some((approver) =>
  //   approver.users.some(
  //     (user) => user.id === currentUser.user_id && user.editable === true
  //   )
  // ); 


const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

const navigate = useNavigate();


  // useEffect(() => {
  //   if(formId == 1){
  //     getQaDetails();
  //   }
  //   if(formId == 2){
  //     getScrfDetails();
  //   }
  //   if(formId == 3){
  //     getDeploymentDetails(); 
  //   }
  //   if(formId == 4){
  //     getEquipmentsRequestById();
  //   }
  //   if(formId == 5){
  //     getMRDetails();
  //   }
  //   if(formId == 6){
  //     getMdmDetails();
  //   }
  // }, []);


 // const getQaDetails = async () => {
 //    setLoading(true);
 //    await qaService
 //      .getQaDetails(record.id)
 //      .then((response) => {
 //        setData(response);
 //        setLoading(false);
 //      })
 //      .catch((error) => {
 //        console.log("error fetching qa records");
 //      });
 //  };
 //  const getScrfDetails = async () => {
 //    setLoading(true);
 //    await csrfService
 //      .getScrfDetails(record.id)
 //      .then((response) => {
 //        setData(response);
 //        setLoading(false);
 //      })
 //      .catch((error) => {
 //        console.log("error fetching scrf records");
 //      });
 //  };
 //  const getDeploymentDetails = async () => {
 //    setLoading(true);
 //    await deploymentService
 //      .getDeploymentDetails(record.id)
 //      .then((response) => {
 //        setData(response);
 //        setLoading(false);
 //      })
 //      .catch((error) => {
 //        console.log("error fetching deployment records");
 //      });
 //  };
 //  const getEquipmentsRequestById = async () => {
 //    setLoading(true);
 //    await equipmentRequestService
 //      .getEquipmentsRequestById(record.id)
 //      .then((response) => {
 //        setData(response);
 //        setLoading(false);
 //      })
 //      .catch((error) => {
 //        console.log("error fetching crf records");
 //      });
 //  };
 //  const getMRDetails = async () => {
 //    setLoading(true);
 //    await mobileRequisitionService
 //      .getMRDetails(record.id)
 //      .then((response) => {
 //        setData(response);
 //        setLoading(false);
 //      })
 //      .catch((error) => {
 //        console.log("error fetching mdm records");
 //      });
 //  };
 //  const getMdmDetails = async () => {
 //    setLoading(true);
 //    await mdmService
 //      .getMdmDetails(record.id)
 //      .then((response) => {
 //        setData(response);
 //        setLoading(false);
 //      })
 //      .catch((error) => {
 //        console.log("error fetching mdm records");
 //      });
 //  };


 //  if (!record || !record.created_by) {
 //    return null; // Or return a placeholder if needed
 //  }

// const userArray = [];
// if (data?.approvers) {
//   data.approvers.forEach((approver) => {
//     if (approver?.users) {
//       userArray.push(...approver.users); 
//     }
//   });
// }
// const editableContition = true;  
// const currentId = currentUser.user_id;  
// const editRights = userArray.find(editRights => editRights.id === currentId  && editRights.editable === true && editRights.status == 'Processing');


let canEdit = false;

if(record.editable)
{
    canEdit = true;
}
// if (record.created_by.id === currentUser.user_id) {
//   if (record.status === 'Return' || (record.draft_at !== null && record.draft_at !== undefined)) {
//     canEdit = true;
//   }
// }

// if (!canEdit && record.status !== 'Approved' && editRights != null && editRights !== false) {
//   canEdit = true;
// }

  return (
    // <Space>
    //   <Link to={'details/' + record.id}>
    //     <EyeOutlined />
    //   </Link>

    //     {canEdit && (
    //       <Link to={`edit/${record.id}`} style={{ cursor: 'pointer' }}>
    //         <EditOutlined />
    //       </Link>
    //     )}


    //   {/* Simplified draft_at check using optional chaining */}
    //   {record.draft_at?.length > 0 || record.status === 'Return' ? (
    //     <Link
    //       onClick={() => handleDelete(record)}
    //       style={{ cursor: 'pointer' }}
    //     >
    //       <DeleteOutlined />
    //     </Link>
    //   ) : null}

    //   <Button
    //     onClick={() => navigate('/activity-log', { state: { form_id: formId, key: record.id } })}
    //     style={{ cursor: 'pointer', border: 'none', color: '#1677ff'}}
    //   >
    //     <ScheduleOutlined />
    //   </Button>

    // </Space>

    <Space size="middle">
      <Tooltip title="View">
        <Link to={`details/${record.id}`}>
          <EyeOutlined style={{ color: '#1677ff' }} />
        </Link>
      </Tooltip>

      {canEdit && (
        <Tooltip title="Edit">
          <Link to={`edit/${record.id}`}>
            <EditOutlined style={{ color: '#52c41a' }} />
          </Link>
        </Tooltip>
      )}

      {(record.draft_at?.length > 0 || record.status === 'Return') && (
        <Tooltip title="Delete">
          <span onClick={() => handleDelete(record)} style={{ cursor: 'pointer' }}>
            <DeleteOutlined style={{ color: '#ff4d4f' }} />
          </span>
        </Tooltip>
      )}
      
      <Tooltip title="Activity Log">
        <span
          onClick={() => navigate('/activity-log', { state: { form_id: formId, key: record.id } })}
          style={{ cursor: 'pointer' }}
        >
          <ScheduleOutlined style={{ color: '#1677ff' }} />
        </span>
      </Tooltip>
    </Space>

  );
};

export default TableActionBtnsComponent;
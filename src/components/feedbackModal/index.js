import React, { useState, useEffect } from 'react';
import { Button, FloatButton, Modal, Table, Tag } from 'antd';
import qaAssignedService from '../../services/qaAssigned';
import { Style } from '../feedbackModal/style.css';

// Define the Modal component
const FeedbackModal = ({ title, formId, onCancel, assurable_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [formId] = useState();
  const [qaAssigned, setQaAssigned] = useState(null);

  const getQaAssigned = async () => {
    let response;
    response = await qaAssignedService.getQaAssigned(formId, assurable_id);
    console.log(response);
    setQaAssigned(response);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await qaAssignedService.getQaAssigned(formId, assurable_id);
      setQaAssigned(response);
    };

    if (formId) {
      fetchData();
    }
  }, [formId]);

  const showModal = () => {
    setIsModalOpen(true);
    getQaAssigned();
  };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  //   onOk && onOk(); // Call the provided onOk function if it exists
  // };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel && onCancel(); // Call the provided onCancel function if it exists
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'id',
    },
    {
      title: 'QA User',
      dataIndex: 'qa_user.name',
      key: 'qa_user.name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === null ? 'yellow' : 'green'}>{status}</Tag>,
    },
    {
      title: 'Quality Assurances',
      dataIndex: 'quality_assurances',
      key: 'quality_assurances',
      render: (quality_assurances) => (
        quality_assurances.length > 0 ? (
          <Table
            columns={[
              { title: 'Sequence No', dataIndex: 'sequence_no', key: 'sequence_no' },
              { title: 'Request Title', dataIndex: 'request_title', key: 'request_title' },
              { title: 'Submitted At', dataIndex: 'created_at', key: 'created_at' },
              {
                title: '',
                dataIndex: 'action',
                key: 'action',
                render: (_, record) => <a href={`/quality-assurance/details/${record.id}`}>Details</a>
              },
            ]}
            dataSource={quality_assurances.map((assurance) => ({
              key: assurance.id,
              ...assurance,
            }))}
            pagination={false}
            size="small"
          />
        ) : (
         <span align="center"> <Tag color="yellow">Response not submitted yet</Tag></span>
        )
      ),
      colSpan: 3
    },
  ];

  const dataSource = qaAssigned ? qaAssigned.map((assignment, index) => ({
    key: index + 1,
    id: assignment.id,
    'qa_user.name': assignment.qa_user.name,
    status: assignment.status,
    quality_assurances: assignment.quality_assurances,
  })) : [];


  return (
    <>
        <FloatButton description="QA Feedback" shape="square" onClick={showModal} 
        style={{ zIndex: 99999 }} />
      {/* <Button type="primary" onClick={showModal}>
        QA Feedback
      </Button> */}
      <Modal
        title={title}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>
        ]}
        width={1200}
      >
        {qaAssigned ? (
          <Table className='feddback-table'
            columns={columns} dataSource={dataSource} />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};


export default FeedbackModal;
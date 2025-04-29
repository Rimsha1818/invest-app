import React, { useState, useEffect } from 'react';
import { Button, FloatButton, Modal, Table, Tag } from 'antd';
import { Style } from '../feedbackModal/style.css';
import { Link, useNavigate} from 'react-router-dom';
import { EyeOutlined} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const FeedbackModal = ({ title, onCancel, data_deployment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(data_deployment);

  console.log('data_deployment')
  console.log(data_deployment)
  console.log('data_deployment')

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel && onCancel(); 
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'id',
    },
    {
      title: 'Deployment',
      dataIndex: 'request_title',
      key: 'request_title',
    },
    {
      title: 'Sequence No',
      dataIndex: 'sequence_no',
      key: 'sequence_no',
    },
    {
      title: 'Created By',
      dataIndex: ['created_by','email'],
      key: 'created_by',
    },
    {
      title: 'Deployed At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Actions',
      key: 'Actions',
      width: 100,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
      render: (text, record) => record && (
        <Link to={`/deployment/details/${record.id}`}>
          <EyeOutlined style={{ color: '#1677ff' }} />
        </Link>
      ),
    },

  ];


const expandedRowRender = (record) => {
  const innerColumns = [
    {
      title: '',
      dataIndex: '',
      width: 3,
    },
    {
      title: 'Document No',
      dataIndex: 'document_no',
      key: 'document_no',
      width: 180,
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      width: 200,
    },
  ];
  return (
    <Table
      columns={innerColumns}
      dataSource={record.deployment_details}
      pagination={false}
      rowKey="id"
    />
  );
};
  const dataSource = data_deployment ? data_deployment.map((deployment, index) => ({
    key: index + 1,
    id: deployment.id,
    request_title: deployment.request_title,
    sequence_no: deployment.sequence_no,
    created_by: deployment.created_by,
    created_at: deployment.created_at,
    deployment_details: deployment.deployment_details,

    
  })) : [];

  return (
    <>
    <FloatButton
      description="Deployments"
      shape="square"
      onClick={showModal}
      style={{
        zIndex: 99999,
        bottom: 48,
        right: 170,
        top: 'auto',
      }}
    />
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
        {data_deployment ? (
          <Table className='feddback-table'
            columns={columns} dataSource={dataSource} expandable={{ expandedRowRender }} />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default FeedbackModal;
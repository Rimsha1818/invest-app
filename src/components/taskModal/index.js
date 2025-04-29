import React, { useState } from 'react';
import { Button, FloatButton, Modal, Table } from 'antd';

const TaskModal = ({ title, onCancel, data_tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(data_tasks);

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Start Time',
      dataIndex: 'start_at',
      key: 'start_at',
    },
    {
      title: 'End Time',
      dataIndex: 'due_at',
      key: 'due_at',
    },
  ];

  const dataSource = data_tasks
    ? Array.from(
        new Map(
          data_tasks
            .filter(item => item.start_at && item.due_at) // remove null dates
            .map(item => [
              `${item.name}-${item.start_at}-${item.due_at}`,
              item,
            ])
        ).values()
      ).map((tasksMembers, index) => ({
        key: index + 1,
        id: tasksMembers.id,
        name: tasksMembers.name,
        email: tasksMembers.email,
        start_at: tasksMembers.start_at,
        due_at: tasksMembers.due_at,
      }))
  : [];

  return (
    <>
    <FloatButton
      description="Task Statuses"
      shape="square"
      onClick={showModal}
      style={{
        zIndex: 99999,
        bottom: 'auto',
        right: 25,
        top: 10,
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
        {data_tasks ? (
          <Table className='feddback-table'
            columns={columns} dataSource={dataSource}  />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default TaskModal;
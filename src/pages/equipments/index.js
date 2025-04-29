import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, Space, Card, notification } from 'antd';
import { SearchOutlined, EnvironmentOutlined,EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import equipmentService from '../../services/equipments';

const Equipments = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [editing, setEditing] = useState(null);

  const searchInput = useRef(null);

  const getEquipments = async (page = 1) => {
    setLoading(true);

    await equipmentService.getEquipments().then((response) => {
      setData(response);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  useEffect(() => {
    getEquipments();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the Equipment: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await equipmentService.deleteEquipment(record.id);
          if (response.success) {
            notification.success({
              message: 'Equipment Deleted',
              description: response.message,
            });
            getEquipments(currentPage);
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: error.response.data.message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text}
        />
      ) : (
        text
      ),
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const handleEdit = record => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        const response = await equipmentService.updateEquipment(editing.id, values);

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: 'Equipment Updated',
            description: response.message,
          });

          getEquipments(currentPage);
        }

      } else {
        const response = await equipmentService.postEquipment(values);

        if (response.success) {
          
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();

          notification.success({
            message: 'Equipment Added',
            description: response.message,
          });

          getEquipments(currentPage);
        }

      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Equipment Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      // ...getColumnSearchProps('name'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <Space>
        <div
     onClick={() => handleEdit(record)}
     style={{ cursor: 'pointer' }}
   >
     <EditOutlined /> 
   </div>
 
   <div
     onClick={() => handleDelete(record)}
     style={{ cursor: 'pointer' }}
   >
     <DeleteOutlined /> 
   </div>
   </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<EnvironmentOutlined />}
            title="Equipments"
            right={(
              <Button className='btn-blue' type="primary" onClick={showModal}>
                Add Equipment
              </Button>
            )}
          />
        </Col>
      </Row>

      <Card>
        <Table
          style={{ minHeight: '100vh' }}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          loading={loading}
          
  pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getEquipments(page),
          }}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Equipment' : 'Add Equipment'}
        open={isModalVisible}
        onCancel={handleCancel}
        width={650}
        footer={null}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} className='mt-20' layout="vertical">
          <Form.Item
            name="name"
            label="Equipment Name"
            rules={[
              { required: true, message: 'Please enter the Equipment' },
            ]}
          >
            <Input size='large' placeholder="Type Equipment Name" />
          </Form.Item>
          <Form.Item>
            
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? 'Save Changes' : 'Add Equipment'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default Equipments;

import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Tag, Card, Space, Form, Select, Input, notification, Modal } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import equipmentRequestService from '../../services/equipmentRequest';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Excel } from "antd-table-saveas-excel";
import { useMediaQuery } from 'react-responsive';
import TableActionBtnsComponent from '../../components/tableActionsBtns';

import sapService from '../../services/sap';


const { confirm } = Modal;

const searchOptions = [
  { key: 'sequence_no', value: 'Sequence No' },
  { key: 'request_title', value: 'Request Title' },
];

const GetEquipmentRequest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { currentUser } = useSelector((state) => state.user);
  const [searchForm] = Form.useForm();
  const [formVisible, setFormVisible] = useState(false);
  const [formId] = useState(7);

  const onSearch = async (values) => {
    console.log(values)
    setLoading(true);
    try {
      const response = await sapService.searchSap(values);
      setData(response.data);
      setCurrentPage(response.current_page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);

    } catch (error) {
      console.error('Error while searching SAP Forms:', error);
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Are you sure you want to delete this Capital Request Form?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await equipmentRequestService.deleteCrf(record.id);
          if (response.success) {
            notification.success({
              message: 'Capital Request Form Deleted',
              description: response.message,
            });
            await getSap(currentPage, itemsPerPage);
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: error.response.data.message,
          });
        }
      },
      onCancel() {
        console.log('Delete action cancelled');
      },
    });
  };

  const columns = [
    {
      title: 'Sequence No',
      dataIndex: 'sequence_no',
      key: 'sequence_no',
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      sorter: true,
    },
    {
      title: 'Request Title',
      dataIndex: 'request_title',
      key: 'request_title',
      sorter: true,
      render: text => text.length > 40 ? `${text.slice(0, 40)}...` : text,
    },
    {
      title: 'Location',
      dataIndex: ['location', 'name'],
      key: 'location',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={(status === 'Pending' && 'orange') || (status === 'Approved' && 'green') || (status === 'Return' && 'red')}>{status}</Tag>,
      sorter: true,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
    },
    {
      title: 'Actions',
      dataIndex: 'Actions',
      key: 'Actions',
      width: 80,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
      render: (text, record) => (
        <TableActionBtnsComponent record={record} handleDelete={handleDelete} currentUser={currentUser} formId={formId}
         />
      ),
    },
  ];



  const handleClick = () => {
    const excelColumns = columns
      .filter(column => column.key !== 'Actions')
      .map(column => {
        const { render, ...columnWithoutRender } = column;
        return columnWithoutRender;
      });

    const excel = new Excel();
    excel
      .addSheet("data")
      .addColumns(excelColumns)
      .addDataSource(data, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };



  const getSap = async (page = 1, itemsPerPage = 15, sortBy = '', sortOrder = '') => {
    setLoading(true);
    console.log(page, itemsPerPage, sortBy, sortOrder)
    await sapService.getSap(page, itemsPerPage, sortBy, sortOrder).then((response) => {
      console.log('YEs here')
      console.log(response)
      setTotalDataCount(response.meta.total);
      setCurrentPage(response.meta.current_page);
      setData(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getSap();
  }, []);

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<SolutionOutlined />}
            title="SAP Access Form"
            right={(
              <>
                <Button onClick={handleClick} className='mr-10'>Export</Button>
                <Link to="/sap-access-form/add">
                  <Button className='btn-blue' type="primary">
                    Add SAP Access Form
                  </Button>
                </Link>
              </>
            )}
          />
        </Col>
      </Row>

      <Card>
        <Button onClick={toggleFormVisibility}>
          {formVisible ? 'Hide Search Form' : 'Show Search Form'}
        </Button>

        {formVisible && (
          <Form form={searchForm} onFinish={onSearch} layout="vertical">
            <Card className="pt-6" style={{ paddingBottom: '0 !important' }}>
              <Row gutter={[12, 12]}>
                {[
                  { key: 'sequence_no', placeholder: 'Sequence No' },
                  { key: 'request_title', placeholder: 'Request Title' },
                ].map(({ key, placeholder }) => (
                  <Col key={key} lg={6} md={12} sm={24} xs={24}>
                    <Form.Item name={key}>
                      <Input size='large' placeholder={`${placeholder}`} />
                    </Form.Item>
                  </Col>
                ))}
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Button block className="btn-blue" htmlType="submit" type="primary">
                    Search
                  </Button>
                </Col>
              </Row>
            </Card>
          </Form>
        )}
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          style={{ minHeight: '100vh' }}
          scroll={{ x: 1200 }}
          sticky={true}
          loading={loading}
          pagination={{
            showSizeChanger: false,
            current: currentPage,
            total: totalDataCount,
            pageSize: itemsPerPage,
          }}
          onChange={(pagination, filters, sorter) => {
            const { order, field } = sorter;
            const sortOrder = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
            getSap(pagination.current, pagination.pageSize, field, sortOrder);
          }}
         

        />
      </Card>
    </DefaultLayout>
  );
};

export default GetEquipmentRequest;

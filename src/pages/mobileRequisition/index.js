import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Card, Form, notification, Modal } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Excel } from "antd-table-saveas-excel";
import { useMediaQuery } from 'react-responsive';
import MobileRequisitionService from '../../services/mobileRequisition';
import TableActionBtnsComponent from './../../components/tableActionsBtns';
const { confirm } = Modal;

const MobileRequisition = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalDataCount, setTotalDataCount] = useState(0); 
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const { currentUser } = useSelector((state) => state.user);
  const [searchForm] = Form.useForm();
  const [formVisible, setFormVisible] = useState(false);
  const [formId, setFormId] = useState(5);


  

  const onSearch = async (values) => {
    console.log(values)
    setLoading(true);
    try {
      const response = await MobileRequisitionService.search(values);
      setData(response.data);
      setCurrentPage(response.current_page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
      
    } catch (error) {
      console.error('Error while searching:', error);
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible); 
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Are you sure you want to delete this Mobile Requisition?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await MobileRequisitionService.delete(record.id);
          if (response.success) {
            notification.success({
              message: 'Mobile Requisition Deleted',
              description: response.message,
            });
            await getEquipmentsRequest(currentPage, itemsPerPage);
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
      width: 200,
      sorter: true,
    },
    {
      title: 'Employee Name / No#',
      dataIndex: ['request_for_user', 'name'],
      key: 'request_for_user',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
    },
    {
      title: 'Department',
      dataIndex: ['department', 'name'],
      key: 'department',
      width: 200,
    },
    {
      title: 'Location',
      dataIndex: ['location', 'name'],
      key: 'location',
      width: 200,
    },
    {
      title: 'Designation',
      dataIndex: ['designation', 'name'],
      key: 'designation',
      width: 200,
    },
    {
      title: 'Section',
      dataIndex: ['section', 'name'],
      key: 'section',
      width: 200,
    },
    {
      title: 'Make',
      dataIndex: ['make', 'name'],
      key: 'make',
      width: 200,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 200,
    },
    {
      title: 'IMEI',
      dataIndex: 'imei',
      key: 'imei',
      width: 200,
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile_number',
      key: 'mobile_number',
      width: 200,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'Actions',
    //   key: 'Actions',
    //   width: 80,
    //   fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
    //   render: (text, record) => (
    //     <TableActionBtnsComponent record={record} handleDelete={handleDelete} currentUser={currentUser} 
    //       formId={formId}
    //      />

    //   ),
    // },
    {
      title: 'Actions',
      dataIndex: 'Actions',
      key: 'Actions',
      width: 120, // wider for spacing
      fixed: 'right',
      render: (text, record) => (
        <TableActionBtnsComponent
          record={record}
          handleDelete={handleDelete}
          currentUser={currentUser}
          formId={formId}
        />
      ),
    }
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

const getEquipmentsRequest = async (
    page = 1,
    itemsPerPage = 15,
    sortBy = '',
    sortOrder = ''
  ) => {
    setLoading(true);
    try {
      const response = await MobileRequisitionService.get(
      page, itemsPerPage, sortBy, sortOrder
      );
      setTotalDataCount(response.meta.total);
      setCurrentPage(response.meta.current_page);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };


  // const getEquipmentsRequest = async (page = 1, itemsPerPage = 15, sortBy = '', sortOrder = '') => {
  //   setLoading(true);
  //   console.log(page, itemsPerPage, sortBy, sortOrder)
  //   await MobileRequisitionService.get(page, itemsPerPage, sortBy, sortOrder).then((response) => {
  //    //console.log(response)
  //     setTotalDataCount(response.meta.total);
  //     setCurrentPage(response.meta.current_page);
  //     setData(response.data);
  //     setLoading(false);
  //   });
  // };

  useEffect(() => {
    getEquipmentsRequest();
  }, []);

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<SolutionOutlined />}
            title="Mobile Requisition"
            right={(
              <>
                <Button onClick={handleClick} className='mr-10'>Export</Button>
                <Link to="/mobile-requisition/add">
                  <Button className='btn-blue' type="primary">
                    Add Mobile Requisition
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

                {/* Add form fields here */}
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
            getEquipmentsRequest(pagination.current, pagination.pageSize, field, sortOrder);
          }}
        />
      </Card>
    </DefaultLayout>
  );
};

export default MobileRequisition;

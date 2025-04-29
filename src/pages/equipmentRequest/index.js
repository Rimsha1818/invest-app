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

const { confirm } = Modal;

const searchOptions = [
  { key: 'sequence_no', value: 'Sequence No' },
  { key: 'request_title', value: 'Request Title' },
  { key: 'request_specs', value: 'Request Specs' },
  { key: 'change_type', value: 'Change Type' },
  { key: 'change_priority', value: 'Change Priority' },
  { key: 'man_hours', value: 'Man Hours' },
  { key: 'process_efficiency', value: 'Process Efficiency' },
  { key: 'controls_improved', value: 'Controls Improved' },
  { key: 'cost_saved', value: 'Cost Saved' },
  { key: 'legal_reasons', value: 'Legal Reasons' },
  { key: 'change_significance', value: 'Change Significance' },
  { key: 'other_benefits', value: 'Other Benefits' },
  { key: 'workflow_id', value: 'Workflow' },
  { key: 'software_category', value: 'Software Category' },
  { key: 'business_expert_id', value: 'Business Expert' },
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
  const [formId] = useState(4);

  const onSearch = async (values) => {
    console.log(values)
    setLoading(true);
    try {
      const response = await equipmentRequestService.searchCrf(values);
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
      title: 'Cost Center',
      dataIndex: ['cost_center_id', 'cost_center'],
      key: 'cost_center',
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
      width: 120,
      key: 'created_at',
      sorter: true,
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'Actions',
    //   key: 'Actions',
    //   width: 80,
    //   fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
    //   render: (text, record) => (
    //     <TableActionBtnsComponent record={record} handleDelete={handleDelete} currentUser={currentUser} formId={formId}
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


  const expandedRowRender = (record) => {
    const equipmentColumns = [
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
      },
      {
        title: 'State',
        dataIndex: ['state', 'name'],
        key: ['state', 'name'],
      },
      {
        title: 'Expense Type',
        dataIndex: ['expense_type', 'name'],
        key: ['expense_type', 'name'],
      },
      {
        title: 'Expense Nature',
        dataIndex: ['expense_nature', 'name'],
        key: ['expense_nature', 'name'],
      },
      {
        title: 'Business Justification',
        dataIndex: 'business_justification',
        key: 'business_justification',
      },
    ];

    const softwareColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'software_name',
      },
      {
        title: 'Version',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'software_qty',
      },
      {
        title: 'Expense Type',
        dataIndex: ['expense_type', 'name'],
        key: ['expense_type', 'name'],
      },
      {
        title: 'Expense Nature',
        dataIndex: ['expense_nature', 'name'],
        key: ['expense_nature', 'name'],
      },
      {
        title: 'Business Justification',
        dataIndex: 'business_justification',
        key: 'business_justification',
      },
    ];

    const serviceColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'service_name',
      },
      {
        title: 'State',
        dataIndex: ['state', 'name'],
        key: ['state', 'name'],
      },
      {
        title: 'Expense Type',
        dataIndex: ['expense_type', 'name'],
        key: ['expense_type', 'name'],
      },
      {
        title: 'Expense Nature',
        dataIndex: ['expense_nature', 'name'],
        key: ['expense_nature', 'name'],
      },
      {
        title: 'Business Justification',
        dataIndex: 'business_justification',
        key: 'business_justification',
      },
    ];

    return (
      <div>
        {record.equipmentRequests && record.equipmentRequests.length > 0 &&
          <>        <h4 className='mb-4 mt-4'>Equipment Requests:</h4>
            <Table columns={equipmentColumns} dataSource={record.equipmentRequests} pagination={false} style={{ borderLeft: '2px solid #1599fd' }} />
          </>
        }

        {record.softwareRequests && record.softwareRequests.length > 0 &&
          <>
            <h4 className='mb-4 mt-4'>Software Requests:</h4>
            <Table columns={softwareColumns} dataSource={record.softwareRequests} pagination={false} style={{ borderLeft: '2px solid #1599fd' }} />
          </>
        }
        {record.serviceRequests && record.serviceRequests.length > 0 && <>
          <h4 className='mb-4 mt-4'>Service Requests:</h4>
          <Table columns={serviceColumns} dataSource={record.serviceRequests} pagination={false} style={{ borderLeft: '2px solid #1599fd' }} />

        </>}
      </div>
    );
  };

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



  const getEquipmentsRequest = async (page = 1, itemsPerPage = 15, sortBy = '', sortOrder = '') => {
    setLoading(true);
    console.log(page, itemsPerPage, sortBy, sortOrder)
    await equipmentRequestService.getEquipmentsRequest(page, itemsPerPage, sortBy, sortOrder).then((response) => {
      //console.log(response)
      setTotalDataCount(response.meta.total);
      setCurrentPage(response.meta.current_page);
      setData(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getEquipmentsRequest();
  }, []);

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<SolutionOutlined />}
            title="Capital Request Form"
            right={(
              <>
                <Button onClick={handleClick} className='mr-10'>Export</Button>
                <Link to="/crf/add">
                  <Button className='btn-blue' type="primary">
                    Add Capital Request Form
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
                  { key: 'location', placeholder: 'Location' },
                  { key: 'equipmentRequests', placeholder: 'Equipment Request' },
                  { key: 'serviceRequests', placeholder: 'Service Request' },
                  { key: 'softwareRequests', placeholder: 'Software Request' },
                  { key: 'cost_center', placeholder: 'Cost Center' },
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
            getEquipmentsRequest(pagination.current, pagination.pageSize, field, sortOrder);
          }}
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
              } else {
                setExpandedRowKeys((prevKeys) => prevKeys.filter((key) => key !== record.id));
              }
            },
          }}

        />
      </Card>
    </DefaultLayout>
  );
};

export default GetEquipmentRequest;

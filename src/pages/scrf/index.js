import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Modal,
  Dropdown,
  Menu,
  Row,
  Col,
  Table,
  Card,
  notification,
  Tag,
  Checkbox,
  Select,
} from 'antd';
import { UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Excel } from 'antd-table-saveas-excel';
import scrfService from '../../services/scrf';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import './index.css';
import { useMediaQuery } from 'react-responsive';
import TableActionBtnsComponent from '../../components/tableActionsBtns';
import categoryService from '../../services/category';
import subCategoryService from '../../services/subCategory';

const { confirm } = Modal;

const Scrf = () => {
  const [searchForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [scrfLoading, setScrfLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [formId, setFormId] = useState(2);


  const handleSubCategories = async () => {
    try {
      const response = await subCategoryService.getAllSubCategories();
      console.log(response)
      setSubCategories(response);
    } catch (error) {
      console.error('Error while fetching subCategories:', error);
    }
  };

  const getCategories = async () => {
    const response = await categoryService.getAllCategories();
    setCategories(response);
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  const onSearch = async (values) => {
    console.log(values)
    setScrfLoading(true);
    try {
      const response = await scrfService.searchScrf(values);
      //console.log(response)
      setData(response.data);
      setCurrentPage(response.current_page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setScrfLoading(false);
    } catch (error) {
      console.error('Error while searching:', error);
    }
  };

  const columns = [
    {
      title: 'Sequence No',
      dataIndex: 'sequence_no',
      key: 'sequence_no',
      width: 150,
      className: 'resizable-column',
      sorter: true,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
    },
    {
      title: 'Request Title',
      dataIndex: 'request_title',
      key: 'request_title',
      width: 180,
      className: 'resizable-column',
      sorter: true,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      render: (text) => (text && text.length > 40 ? `${text.slice(0, 40)}...` : text),
    },
    {
      title: 'Software Category',
      dataIndex: ['software_category', 'name'],
      key: 'software_category',
      width: 180,
      sorter: true,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      render: (text, record) => record?.software_category?.name || 'N/A', // Optional chaining
    },
    {
      title: 'Subcategory',
      dataIndex: ['software_subcategories', 'name'],
      key: 'software_subcategories',
      width: 200,
      sorter: true,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'left' : null,
      render: (text, record) => {
        if (record.software_subcategories && Array.isArray(record.software_subcategories)) {
          return record.software_subcategories.map((subcategory) => subcategory.name).join(', ');
        } else {
          return 'N/A';
        }
      }
    },
    {
      title: 'Change Type',
      dataIndex: 'change_type',
      key: 'change_type',
      width: 120,
      sorter: true,
    },
    {
      title: 'Change Priority',
      dataIndex: 'change_priority',
      key: 'change_priority',
      width: 180,
      sorter: true,
    },
    {
      title: 'Request Specs',
      dataIndex: 'request_specs',
      key: 'request_specs',
      width: 180,
      sorter: true,
      render: (text) => (text && text.length > 40 ? `${text.slice(0, 40)}...` : text), // Check for text existence
    },
    {
      title: 'Process Efficiency',
      dataIndex: 'process_efficiency',
      key: 'process_efficiency',
      width: 180,
      sorter: true,
      render: (text) => (text && text.length > 40 ? `${text.slice(0, 40)}...` : text), // Check for text existence
    },
    {
      title: 'Cost Saved',
      dataIndex: 'cost_saved',
      key: 'cost_saved',
      width: 180,
      sorter: true,
    },
    // {
    //   title: 'Controls Improved',
    //   dataIndex: 'controls_improved',
    //   key: 'controls_improved',
    //   width: 180,
    //   sorter: true,
    //   render: (text) => (text && text.length > 40 ? `${text.slice(0, 40)}...` : text), // Check for text existence
    // },
    // {
    //   title: 'Legal Reasons',
    //   dataIndex: 'legal_reasons',
    //   key: 'legal_reasons',
    //   width: 180,
    //   sorter: true,
    //   render: (text) => (text && text.length > 40 ? `${text.slice(0, 40)}...` : text), // Check for text existence
    // },
    {
      title: 'Man Hours',
      dataIndex: 'man_hours',
      key: 'man_hours',
      width: 160,
      sorter: true,
    },
    // {
    //   title: 'Other Benefits',
    //   dataIndex: 'other_benefits',
    //   key: 'other_benefits',
    //   width: 180,
    //   sorter: true,
    //   render: (text) => (text && text.length > 40 ? `${text.slice(0, 40)}...` : text), // Check for text existence
    // },
    {
      title: 'Department',
      dataIndex: ['department', 'name'],
      key: 'department',
      width: 120,
      sorter: true,
      render: (text, record) => record?.department?.name || 'N/A', // Optional chaining
    },
    {
      title: 'Location',
      dataIndex: ['location', 'name'],
      key: 'location',
      width: 120,
      sorter: true,
      render: (text, record) => record?.location?.name || 'N/A', // Optional chaining
    },
    // {
    //   title: 'Designation',
    //   dataIndex: ['designation', 'name'],
    //   key: 'designation',
    //   width: 120,
    //   sorter: true,
    //   render: (text, record) => record?.designation?.name || 'N/A', // Optional chaining
    // },
    // {
    //   title: 'Section',
    //   dataIndex: ['section', 'name'],
    //   key: 'section',
    //   width: 120,
    //   sorter: true,
    //   render: (text, record) => record?.section?.name || 'N/A', // Optional chaining
    // },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      sorter: true,
    },
    {
      title: 'Significance',
      dataIndex: 'change_significance',
      key: 'change_significance',
      width: 90,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'scrfStatus',
      sorter: true,
      width: 100,
      render: (status) => (
        <Tag  color={(status === 'Pending' && 'orange') || (status === 'Approved' && 'green') || (status === 'Return' && 'red')}>{status}</Tag>
      ),
      fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
    },
    {
      title: 'Actions',
      key: 'Actions',
      width: 100,
      sorter: true,
      fixed: useMediaQuery({ minWidth: 768 }) ? 'right' : null,
      render: (text, record) => record && ( // Check if record exists
        <TableActionBtnsComponent
          record={record}
          handleDelete={handleDelete}
          currentUser={currentUser}
          formId={formId}
          
        />
      ),
    },
    
  ];

  const getScrf = async (
    page = 1,
    itemsPerPage = 15,
    sortBy = '',
    sortOrder = ''
  ) => {
    setScrfLoading(true);
    try {
      const response = await scrfService.getScrf(
        page,
        itemsPerPage,
        sortBy,
        sortOrder
      );
      console.log(response);
      setData(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalDataCount(response.meta.total);
      setItemsPerPage(response.meta.per_page);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setScrfLoading(false);
    }
  };

  const handleClick = () => {
    const excelColumns = columns
      .filter((column) => column.key !== 'Actions')
      .map((column) => {
        const { render, ...columnWithoutRender } = column;
        return columnWithoutRender;
      });

    const excel = new Excel();
    excel
      .addSheet('data')
      .addColumns(excelColumns)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs('Excel.xlsx');
  };

  const [visibleColumns, setVisibleColumns] = useState(() =>
    columns.map((column) => column.key)
  );

  const handleColumnToggle = (key) => {
    const updatedVisibleColumns = [...visibleColumns];

    if (visibleColumns.includes(key)) {
      const index = updatedVisibleColumns.indexOf(key);
      if (index > -1) {
        updatedVisibleColumns.splice(index, 1);
      }
    } else {
      updatedVisibleColumns.push(key);
    }

    setVisibleColumns(updatedVisibleColumns);

    try {
      localStorage.setItem(
        'visibleColumns',
        JSON.stringify(updatedVisibleColumns)
      );
    } catch (error) {
      console.error('Error saving visibleColumns to local storage:', error);
    }
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Are you sure you want to delete this record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await scrfService.deleteScrf(record.id);
          if (response.success) {
            notification.success({
              message: 'Deleted Successfully',
              description: response.message,
            });
            await getScrf(currentPage);
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

  useEffect(() => {
    getScrf();
    getCategories();
    handleSubCategories();
  }, []);

  useEffect(() => {
    try {
      const savedVisibleColumns = localStorage.getItem('visibleColumns');
      if (savedVisibleColumns) {
        setVisibleColumns(JSON.parse(savedVisibleColumns));
      }
    } catch (error) {
      console.error('Error loading visibleColumns from local storage:', error);
    }
  }, []);

  const expandedRowRender = (records) => {
    const expandedData = Array.isArray(records.uatScenarios)
      ? records.uatScenarios.map((record, index) => ({
        key: record.id || index.toString(),
        detail: record.detail,
        status: record.status,
      }))
      : [];

    const expandedColumns = [
      {
        title: 'Detail',
        dataIndex: 'detail',
        key: 'detail',
      },
      {
        title: 'UAT Status', // Renamed for clarity
        dataIndex: 'status',
        key: 'uatStatus', // Unique key for UAT status
        fixed: 'right',
        width: 80,
        render: (status) => ( // Use "status" directly, as it's already available in the record
          <>
            {status === 'Pass' ? (
              <Tag color="#52c41a" style={{ color: 'white' }}>
                Pass
              </Tag>
            ) : (
              <Tag color="#cd201f" style={{ color: 'white' }}>
                Fail {/* Assuming "Fail" if not "Pass" */}
              </Tag>
            )}
          </>
        ),
      },
    ];

    return (
      <>
        <Table
          columns={expandedColumns}
          pagination={false}
          dataSource={expandedData.map((item) => ({ ...item, key: item.id }))}
          style={{ borderLeft: '2px solid #1599fd' }}
        />
      </>
    );
  };

  const menu = (
    <Menu>
      {columns.map((column) => (
        <Menu.Item key={column.key}>
          <Checkbox
            className="mr-5"
            style={{ fontSize: '12px' }}
            onChange={() => handleColumnToggle(column.key)}
            checked={visibleColumns.includes(column.key)}
          >
            {column.title}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<FileTextOutlined />}
            title="Software Change Request Form"
            right={
              <>
                <Button onClick={handleClick} className="mr-10">
                  Export
                </Button>

                <Link to={`/scrf/add/`}>
                  <Button className="btn-blue" type="primary">
                    Add Software Change Request Form
                  </Button>
                </Link>
              </>
            }
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
                  { key: 'comments', placeholder: 'Comments' },
                  { key: 'request_specs', placeholder: 'Request Specs' },
                  { key: 'change_type', placeholder: 'Change Type' },
                  { key: 'change_priority', placeholder: 'Change Priority' },
                  { key: 'man_hours', placeholder: 'Man Hours' },
                  {
                    key: 'process_efficiency',
                    placeholder: 'Process Efficiency',
                  },
                  // {
                  //   key: 'controls_improved',
                  //   placeholder: 'Controls Improved',
                  // },
                  { key: 'cost_saved', placeholder: 'Cost Saved' },
                  // { key: 'legal_reasons', placeholder: 'Legal Reasons' },
                  {
                    key: 'change_significance',
                    placeholder: 'Change Significance',
                  },
                ].map(({ key, placeholder }) => (
                  <Col key={key} lg={6} md={12} sm={24} xs={24}>
                    <Form.Item name={key}>
                      <Input size="large" placeholder={`${placeholder}`} />
                    </Form.Item>
                  </Col>
                ))}


                <Col lg={6} md={12} sm={24} xs={24}>
                  <Form.Item name="software_category">
                    <Select
                      showSearch={true}
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Please Select Category"
                      allowClear
                    >
                      {categories &&
                        categories.map((category) => (
                          <Select.Option key={category.id} value={category.name}>
                            {category.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col lg={6} md={12} sm={24} xs={24}>
                  <Form.Item name="software_subcategories">
                    <Select
                      showSearch={true}
                      optionFilterProp="children"
                      placeholder="Subcategory"
                      allowClear={true}
                      size="large"
                    >
                      {subCategories.map((subCategory) => (
                        <Select.Option key={subCategory.id} value={subCategory.name}>
                          {subCategory.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Button
                    block
                    className="btn-blue"
                    htmlType="submit"
                    type="primary"
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Card>
          </Form>
        )}
      </Card>

      <Row>
        <Col span={24}>
          <Card>
            <Dropdown
              className="mr-10"
              overlay={menu}
              open={visible}
              onOpenChange={(isVisible) => setVisible(isVisible)}
              trigger={['click']}
            >
              <button // Replaced <a> with <button>
                style={{
                  color: 'black',
                  fontSize: '11px',
                  color: 'gray',
                  background: 'transparent', // Make button background transparent
                  border: 'none', // Remove button border
                  padding: 0, // Remove default button padding
                  cursor: 'pointer' // Set cursor to pointer
                }}
                onClick={(e) => e.preventDefault()}
              >
                <UnorderedListOutlined /> Columns
              </button>
            </Dropdown>

            <Table
              size="small"
              columns={columns.filter((column) =>
                visibleColumns.includes(column.key)
              )}
              style={{ minHeight: '100vh' }}
              dataSource={data.map((item) => ({ ...item, key: item.id }))}
              pagination={{
                showSizeChanger: false,
                current: currentPage,
                total: totalDataCount,
                pageSize: itemsPerPage,
              }}
              loading={scrfLoading}
              scroll={{
                x: 1400,
                y: 'calc(100vh - 300px)',
              }}
              sticky={true}
              expandable={{
                expandedRowRender,
                onExpand: (expanded, record) => {
                  if (expanded) {
                    setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
                  } else {
                    setExpandedRowKeys((prevKeys) =>
                      prevKeys.filter((key) => key !== record.key)
                    );
                  }
                },
              }}
              onChange={(pagination, filters, sorter) => {
                const { order, field } = sorter;
                const sortOrder =
                  order === 'ascend'
                    ? 'asc'
                    : order === 'descend'
                      ? 'desc'
                      : '';
                getScrf(
                  pagination.current,
                  pagination.pageSize,
                  field,
                  sortOrder
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </DefaultLayout>
  );
};

export default Scrf;

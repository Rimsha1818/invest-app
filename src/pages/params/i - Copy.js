import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Avatar,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Card,
  Checkbox,
  notification,
  Menu,
  Dropdown,
  Tag,
  Upload,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  CodepenOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './index.css';
import DefaultLayout from './../../components/layout/DefaultLayout';
import Header from '../../components/header';
import companyService from '../../services/company';
import sectionService from '../../services/section';
import roleService from '../../services/role';
import authService from '../../services/auth';
import auth from '../../services/auth';
import { useMediaQuery } from 'react-responsive';
import { Excel } from 'antd-table-saveas-excel';
import LocationComponent from '../../components/location';
import DesignationComponent from '../../components/designation';
import DepartmentComponent from '../../components/department';
import RoleComponent from '../../components/role';
import envConfig from '../../env.js';
import CompanyComponent from '../../components/company';


const UsersData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [form] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sections, setSections] = useState([]);

  const flag = envConfig.flag; 

  const { Option } = Select;
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputtChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]); // Add new tag
    }
    setInputValue(""); // Clear input field
  };

  const removeTag = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag)); // Remove tag
  };


  // const baseURL = envConfig.API_URL || envConfig[flag]?.API_URL;
  const baseURL = (envConfig.API_URL || envConfig[flag]?.API_URL).replace(/\/api$/, '');
  

  const [selectLoading, setSelectLoading] = useState(false);

  const [roles, setRoles] = useState([]);
  const [isProfilePictureModalVisible, setIsProfilePictureModalVisible] =
    useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showProfilePictureModal = () => {
    setIsProfilePictureModalVisible(true);
  };

  const hideProfilePictureModal = () => {
    setIsProfilePictureModalVisible(false);
  };

  const showChangePasswordModal = (record) => {
    setSelectedUser(record);
    setIsChangePasswordModalVisible(true);
  };

  const hideChangePasswordModal = () => {
    setIsChangePasswordModalVisible(false);
  };

  const onChangePassword = async (values) => {
    setLoading(true);
    try {
      const response = await authService.updatePassword(
        selectedUser.id,
        values
      );
      if (response.success) {
        setLoading(false);
        notification.success({
          message: 'Password Updated',
          description: response.message,
        });
        hideChangePasswordModal();
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };


  // Image Work Updated
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList); 

    if (newFileList.length > 0) {
      const lastFile = newFileList[newFileList.length - 1];

      
      const file = lastFile.originFileObj; 
      const reader = new FileReader();

      // console.log('thinkkk')
      // console.log(file);
      reader.onloadend = () => {
        setImagePreview(reader.result); 
        setLogoImage(file); 
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreview(null); 
      setLogoImage(null); 
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImagePreview(null); 
    setLogoImage(null); 
    setFileList([]); 
  };

  // Image Work Updated



  const getDepartmentOfSection = async (departmentId) => {
    setSelectLoading(true);
    try {
      const response = await sectionService.getDepartmentOfSection(
        departmentId
      );
      // console.log('Department sections:', response);

      if (Array.isArray(response) && response.length > 0) {
        setSections(response);
      } else {
        setSections([]);
        form.setFieldsValue({
          section_id: null,
        });
      }
    } catch (error) {
      console.error('Error fetching department sections:', error);
      notification.error({
        message: 'Error',
        description: error.response ? error.response : 'An error occurred',
      });
    } finally {
      setSelectLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const response = await roleService.getRoles();
      setRoles(response);
    } catch (error) {}
  };

  useEffect(() => {
    getRoles();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCompany(null);
  };

  const handleEdit = (record) => {
    // console.log('handleEdit');
    // console.log(record);
    setImagePreview(record?.logo ? `${baseURL}/${record.logo}` : null);
    // setImagePreview(record?.logo ? `http://customer1.localhost:9898/${record.logo}` : null);
    setEditingCompany(record);
    form.setFieldsValue({

      name: record.name,
      code: record.code,
      long_name: record.long_name,
      ntn_no: record.ntn_no,
      sales_tax_no: record.sales_tax_no,
      postal_code: record.postal_code,
      address: record.address,
      phone: record.phone,

    });

    setSelectLoading(true);
    // getDepartmentOfSection(record.department.id);
    
    showModal();
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the Company: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await companyService.deleteDepartment(record.id);
          if (response.success) {
            notification.success({
              message: "Company Deleted",
              description: response.message,
            });
            getCompanies();
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.response.data.message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAddUser = () => {
    setImagePreview(null);
    setEditingCompany(null);
    form.resetFields();
    showModal();
  };

  const getCompanies = async (page = 1, itemsPerPage = 15, searchQuery = '') => {
    setLoading(true);
    try {
      const response = await companyService.getAllCompanies(
        page,
        itemsPerPage,
        searchQuery
      );
      setData(response.data);
      // setCurrentPage(response.meta.current_page);
      // setTotalDataCount(response.meta.total);
      // setItemsPerPage(response.meta.per_page);
      // console.log("yes fetched")
      console.log(response)
    } catch (error) {
      console.log(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const handleTableChange = (pagination) => {
    getCompanies(pagination.current, itemsPerPage, searchQuery);
  };

  const handleInputChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    if (newSearchQuery.length > 2 || newSearchQuery === '') {
      getCompanies(1, itemsPerPage, newSearchQuery);
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

  const onFinish = async (values) => {
    //console.log(values)
    //console.log(values)
    const formattedData = new FormData();
    formattedData.append("address", values['address']);
    formattedData.append("code", values['code']);
    formattedData.append("logo_image", values['logo_image']);
    formattedData.append("long_name", values['long_name']);
    formattedData.append("name", values['name']);
    formattedData.append("ntn_no", values['ntn_no']);
    formattedData.append("phone", values['phone']);
    formattedData.append("postal_code", values['postal_code']);
    formattedData.append("sales_tax_no", values['postal_code']);
    formattedData.append("logo", logoImage);
    console.log('formattedData')
    formattedData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
     if (editingCompany) {
        // formattedData.append("logo", imagePreview);
        const response = await companyService.updateCompany(
          editingCompany.id,
          formattedData
        );

        if (response.success) {
          setIsModalVisible(false);
          setEditingCompany(null);

          form.resetFields();

          notification.success({
            message: "Company Data Updated",
            description: response.message,
          });

          getCompanies();
        }
      }
      else {
        setLoading(true);
        let response;

        // response = await companyService.saveCompany(values);
        response = await companyService.saveCompany(formattedData);

        setIsModalVisible(false);
        getCompanies();
        notification.success({
          message: 'Company Added',
          description: response.message,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = `http://customer1.localhost:9898/storage/profiles/1/31c5f97a-2e1d-431d-a5dd-59cafc54096f.jpg`;
  console.log(imageUrl);
  const columns = [
   
    {
      title: 'Parameter',
      data: 'asd',
      key: 'asd',
      width: 50,
    },
    // {
    //   title: 'Ntn#',
    //   dataIndex: 'ntn_no',
    //   key: 'email',
    //   width: 80,
    //   sorter: (a, b) => a.email.localeCompare(b.email),
    // },
    // {
    //   title: 'Sales Tax#',
    //   dataIndex: 'sales_tax_no',
    //   key: 'email',
    //   width: 80,
    //   sorter: (a, b) => a.email.localeCompare(b.email),
    // },
    
    
    {
      title: 'Actions',
      key: 'Actions',
      width: 80,
      render: (text, record) => (
        <Space>
          <div onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }}>
            <EditOutlined />
          </div>

{/*          <div
            onClick={() => showChangePasswordModal(record)}
            style={{ cursor: 'pointer' }}
          >
            <LockOutlined />
          </div>*/}

          {/* <div
         onClick={() => showProfilePictureModal(record)}
     style={{ cursor: 'pointer' }}
   >
     <UserOutlined   /> 
   </div> */}

    <div
     onClick={() => handleDelete(record)}
     style={{ cursor: 'pointer' }}
   >
     <DeleteOutlined /> 
   </div> 
        </Space>
      ),
      fixed: 'right',
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(() =>
    columns.map((column) => column.key)
  );

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

  const handleAction = (record) => {};

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UserOutlined />}
            title="Parameters Values"
            right={
              <>
                {/*<Button onClick={handleClick} className="mr-10">
                  Export
                </Button>*/}

                <Button
                  type="primary"
                  className="btn-blue"
                  onClick={handleAddUser}
                >
                  Add More
                </Button>
              </>
            }
          />
        </Col>
      </Row>

      <Card>
        <Input
          size="large"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </Card>

      <Card>
        <Dropdown
          className="mr-10"
          overlay={menu}
          open={visible}
          onOpenChange={(isVisible) => setVisible(isVisible)}
          trigger={['click']}
        >
          <a
            style={{ color: 'black', fontSize: '11px', color: 'gray' }}
            onClick={(e) => e.preventDefault()}
          >
            <UnorderedListOutlined /> Columns
          </a>
        </Dropdown>

        <Table
          style={{ minHeight: '100vh' }}
          onChange={handleTableChange}
          columns={columns.filter((column) =>
            visibleColumns.includes(column.key)
          )}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          rowKey={(record) => record.key}
          scroll={{ x: 1200 }}
          sticky={true}
          pagination={{
            showSizeChanger: false,
            current: currentPage,
            total: totalDataCount,
            pageSize: itemsPerPage,
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={null}
        open={isChangePasswordModalVisible}
        onCancel={hideChangePasswordModal}
        footer={null}
      >
        <Form
          autoComplete="off"
          form={formPassword}
          onFinish={onChangePassword}
          layout="vertical"
        >
          <Row gutter={[12, 12]}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Passwords do not match');
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Change Password
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* <Modal
          title="Profile Picture"
          open={isProfilePictureModalVisible}
          onCancel={hideProfilePictureModal}
          footer={null}
        >
          <div style={{textAlign: 'center'}}><ProfilePictureComponent user_id={data.id} size={120} /></div>
        </Modal> */}

      <div>
        <Modal
          title={editingCompany ? 'Edit Parameter' : 'Add Parameter'}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          style={{
            top: 20,
          }}
        >
          <Form
            autoComplete="off"
            form={form}
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            className="mt-20"
          >
            <Card size="small" className="mb-10" title="Parameter Values">


              <Row gutter={[12, 12]}>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Form.Item
                    name="name"
                    label="Sequence No"
                    rules={[
                      // { required: true, message: 'Please enter the name' },
                    ]}
                  >
                    <Input size="large" placeholder="Name" />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                <Form.Item
                    name="company_id"
                    label="Company"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a Company',
                      },
                    ]}
                  >
                    <CompanyComponent all={true} />
                  </Form.Item>
                 
                </Col>
              </Row>

              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    name="code"
                    label="Parameter"
                    rules={[
                      { required: true, message: 'Please select a Parameter' },
                    ]}
                  >
                    <Select size="large" placeholder="Select Parameter">
                      <Option value="sales_organization">Sales Organization</Option>
                      <Option value="sales_distribution">Sales Distribution</Option>
                      <Option value="division">Division</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
              </Row>
              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.Item label="Values">
                    <Space>
                      <Input
                        size="large"
                        placeholder="Type a Value"
                        value={inputValue}
                        onChange={handleInputtChange}
                        allowClear
                        style={{ width: '90' }} // Adjust width as per your need
                      />
                      <Button type="primary" onClick={handleInputConfirm}>
                        Add Value
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>

                {/* Display tags */}
                <Col span={24} style={{ marginTop: '10px' }}>
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <div key={tag} style={{ marginBottom: '8px' }}> {/* Each tag in a new line */}
                        <Tag
                          style={{
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                          }}
                          closable
                          onClose={() => removeTag(tag)} // Allow tag removal
                          color="blue"
                          closeIcon={
                            <span style={{ marginLeft: 'auto', cursor: 'pointer' }}> {/* Adjust spacing for close icon */}
                              &#10005; {/* You can use custom close icon if needed */}
                            </span>
                          }
                        >
                          {tag}
                        </Tag>
                      </div>
                    ))
                  ) : (
                    <p>No Values added yet.</p>
                  )}
                </Col>
                
              </Row>

              

            </Card>
   

      
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingCompany ? 'Save Changes' : 'Add Parameter'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UsersData;

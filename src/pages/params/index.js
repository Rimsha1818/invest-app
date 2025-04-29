import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  CodepenOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./index.css";
import DefaultLayout from "./../../components/layout/DefaultLayout";
import Header from "../../components/header";
import paramservice from "../../services/param";
import sectionService from "../../services/section";
import roleService from "../../services/role";
import authService from "../../services/auth";
import auth from "../../services/auth";
import { useMediaQuery } from "react-responsive";
import { Excel } from "antd-table-saveas-excel";
import LocationComponent from "../../components/location";
import DesignationComponent from "../../components/designation";
import DepartmentComponent from "../../components/department";
import RoleComponent from "../../components/role";
import envConfig from "../../env.js";
import CompanyComponent from "../../components/company";

const UsersData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState("");
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

  const [selectLoading, setSelectLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // const getDepartmentOfSection = async (departmentId) => {
  //   setSelectLoading(true);
  //   try {
  //     const response = await sectionService.getDepartmentOfSection(
  //       departmentId
  //     );
  //     // console.log('Department sections:', response);

  //     if (Array.isArray(response) && response.length > 0) {
  //       setSections(response);
  //     } else {
  //       setSections([]);
  //       form.setFieldsValue({
  //         section_id: null,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching department sections:', error);
  //     notification.error({
  //       message: 'Error',
  //       description: error.response ? error.response : 'An error occurred',
  //     });
  //   } finally {
  //     setSelectLoading(false);
  //   }
  // };

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
    form.resetFields();
    setIsModalVisible(false);
    setEditingCompany(null);
  };

  const handleEdit = (record) => {
    let parsedData = [];

    try {
      parsedData = typeof record.data === "string" ? JSON.parse(record.data) : record.data;
    } catch (error) {
      console.error("Error parsing record.data:", error);
    }

    form.setFieldsValue({
      type: record.type,
      company_id: record.company.id,
      
      data: parsedData.map((item) => ({
        value: item.value || "", 
        description: item.description || "", 
      })),

    });

    setSelectLoading(true);
    showModal();
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the Parameter: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await paramservice.deleteParam(record.id);
          if (response.success) {
            notification.success({
              message: "Parameter Deleted",
              description: response.message,
            });
            getParams();
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
    // form.resetFields();
    showModal();
  };

  const getParams = async (page = 1, itemsPerPage = 15, type = "", company_id = "") => {
    setLoading(true);
    try {
      const response = await paramservice.getAllParams(
        page,
        itemsPerPage,
        type,
        company_id,
      );
      setData(response.data);
      // setCurrentPage(response.meta.current_page);
      // setTotalDataCount(response.meta.total);
      // setItemsPerPage(response.meta.per_page);
      // console.log("yes fetched")
    } catch (error) {
      console.log(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getParams();
  }, []);

  const handleTableChange = (pagination) => {
    getParams(pagination.current, itemsPerPage, searchQuery);
  };

  const handleInputChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    if (newSearchQuery.length > 2 || newSearchQuery === "") {
      getParams(1, itemsPerPage, newSearchQuery);
    }
  };

  const handleClick = () => {
    const excelColumns = columns
      .filter((column) => column.key !== "Actions")
      .map((column) => {
        const { render, ...columnWithoutRender } = column;
        return columnWithoutRender;
      });

    const excel = new Excel();
    excel
      .addSheet("data")
      .addColumns(excelColumns)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };



  const onFinish = async (values) => {

    const formattedData = new FormData();
    formattedData.append("type", values["type"]);

      
    values["data"].forEach((item, index) => {
      formattedData.append(`data[${index}][value]`, item.value);
      formattedData.append(`data[${index}][description]`, item.description);
    });


    for (let [key, value] of formattedData.entries()) {
      // console.log(`${key}: ${value}`);
    }
    formattedData.append("parent_id", '');
    formattedData.append("company_id", values["company_id"]);

    formattedData.forEach((value, key) => {
      // console.log(`${key}: ${value}`);
    });


    try {
      if (editingCompany) {
        // Handle editing logic
      } else {
        setLoading(true);
        let response;

        response = await paramservice.saveParam(formattedData);

        setIsModalVisible(false);
        getParams();
        notification.success({
          message: "Parameter Added",
          description: response.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Parameter",
      dataIndex: "type",
      key: "type",
      width: 50,
    },

    {
      title: "Company",
      dataIndex: ["company", "name"],
      key: "type",
      width: 50,
    },

    {
      title: "Actions",
      key: "Actions",
      width: 80,
      render: (text, record) => (
        <Space>
          <div onClick={() => handleEdit(record)} style={{ cursor: "pointer" }}>
            <EditOutlined />
          </div>

          <div
            onClick={() => handleDelete(record)}
            style={{ cursor: "pointer" }}
          >
            <DeleteOutlined />
          </div>
        </Space>
      ),
      fixed: "right",
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
            style={{ fontSize: "12px" }}
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
        "visibleColumns",
        JSON.stringify(updatedVisibleColumns)
      );
    } catch (error) {
      console.error("Error saving visibleColumns to local storage:", error);
    }
  };

  useEffect(() => {
    try {
      const savedVisibleColumns = localStorage.getItem("visibleColumns");
      if (savedVisibleColumns) {
        setVisibleColumns(JSON.parse(savedVisibleColumns));
      }
    } catch (error) {
      console.error("Error loading visibleColumns from local storage:", error);
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

      {/* SEARCH BAR */}
      {/*     <Card>
        <Input
          size="large"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </Card>*/}

      <Card>
        <Dropdown
          className="mr-10"
          overlay={menu}
          open={visible}
          onOpenChange={(isVisible) => setVisible(isVisible)}
          trigger={["click"]}
        >
          <a
            style={{ color: "black", fontSize: "11px", color: "gray" }}
            onClick={(e) => e.preventDefault()}
          >
            <UnorderedListOutlined /> Columns
          </a>
        </Dropdown>

        <Table
          style={{ minHeight: "100vh" }}
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

      <div>
        <Modal
          title={editingCompany ? "Edit Parameter" : "Add Parameter"}
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
                    name="type"
                    label="Parameter"
                    rules={[
                      { required: true, message: "Please select a Parameter" },
                    ]}
                  >
                    <Select size="large" placeholder="Select Parameter">
                      <Option value="saf_sd_sales_organization">
                        (SAF-SD) Sales Organization
                      </Option>
                      <Option value="saf_sd_distribution_channel">
                        (SAF-SD) Distribution Channel
                      </Option>
                      <Option value="saf_sd_division">(SAF-SD) Division</Option>
                      <Option value="saf_sd_sales_office">
                        (SAF-SD) Sales Office
                      </Option>
                      <Option value="saf_sd_sales_group">
                        (SAF-SD) Sales Group
                      </Option>

                      <Option value="saf_mm_purchasing_org">
                        (SAF-MM) Purchasing Org
                      </Option>
                      <Option value="saf_mm_purchasing_group">
                        (SAF-MM) Purchasing Group
                      </Option>
                      <Option value="saf_mm_storage_location">
                        (SAF-MM) Storage Location
                      </Option>
                      <Option value="saf_mm_purchasing_document">
                        (SAF-MM) Purchasing Document
                      </Option>
                      <Option value="saf_mm_movement_type">
                        (SAF-MM) Movement Type
                      </Option>

                      <Option value="saf_pm_planning_plant">
                        (SAF-PM) Planning Plant
                      </Option>
                      <Option value="saf_pm_maintenance_plant">
                        (SAF-PM) Maintenance Plant
                      </Option>
                      <Option value="saf_pm_work_center">
                        (SAF-PM) Work Centers
                      </Option>

                      <Option value="saf_fico_profit_center">
                        (SAF-FICO) Profit Center
                      </Option>
                      <Option value="saf_fico_cost_center">
                        (SAF-FICO) Cost Center
                      </Option>

                      <Option value="saf_hr_personnel_area">
                        (SAF-HR) Personnel Area
                      </Option>
                      <Option value="saf_hr_sub_area">(SAF-HR) Sub Area</Option>
                      <Option value="saf_hr_cost_center">
                        (SAF-HR) Cost Center
                      </Option>
                      <Option value="saf_hr_employee_group">
                        (SAF-HR) Employee Group
                      </Option>
                      <Option value="saf_hr_employee_sup_group">
                        (SAF-HR) Employee Sub Group
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Form.Item
                    name="company_id"
                    label="Company"
                    rules={[
                      {
                        required: true,
                        message: "Please select a Company",
                      },
                    ]}
                  >
                    <CompanyComponent all={true} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.List name="data">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Row key={key} align="middle" gutter={[12, 12]}>
                            <Col flex="auto">
                              <Form.Item
                                {...restField}
                                name={[name, "value"]} // Use the "value" key
                                fieldKey={[fieldKey, "value"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a value",
                                  },
                                ]}
                              >
                                <Input size="large" placeholder="Value" />
                              </Form.Item>
                            </Col>
                            <Col flex="auto">
                              <Form.Item
                                {...restField}
                                name={[name, "description"]} // Use the "description" key
                                fieldKey={[fieldKey, "description"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a description",
                                  },
                                ]}
                              >
                                <Input size="large" placeholder="Description" />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Button type="link" onClick={() => remove(name)}>
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add({ value: "" })}
                            block
                          >
                            Add Parameter Value
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>
            </Card>

            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingCompany ? "Save Changes" : "Add Parameter"}
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

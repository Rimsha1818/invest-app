import React, { useState, useEffect, useRef } from "react";
import {  DatePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Card,
  notification,
  message,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  EditOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
// import { useSelector } from "react-redux";
import departmentService from "../../services/department";

const Departments = () => {
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();

  // const { currentUser } = useSelector((state) => state.user);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the department: ${record.name}?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await departmentService.deleteDepartment(record.id);
          if (response.success) {
            notification.success({
              message: "Department Deleted",
              description: response.message,
            });
            getDepartments(currentPage);
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

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getDepartments = async (page = 1) => {
    setLoading(true);

    await departmentService.getDepartmentUP(page).then((response) => {
      console.log('this is ress')
      console.log(response)
      console.log('this is ress')
      setData(response.data);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    });
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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

  const handleEdit = (record) => {
    console.log('handleEdit')
    console.log(record)
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      if (editing) {
        const response = await departmentService.updateDepartment(
          editing.id,
          values
        );

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);

          form.resetFields();

          notification.success({
            message: "Department Updated",
            description: response.message,
          });

          getDepartments(currentPage);
        }
      } else {
        const response = await departmentService.postDepartment(values);

        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();

          notification.success({
            message: "Department Added",
            description: response.message,
          });

          getDepartments(currentPage);
        }
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      //...getColumnSearchProps('name'),
    },
    {
      title: "Email",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      //...getColumnSearchProps('name'),
    },
    {
      title: "Total Investment",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      //...getColumnSearchProps('name'),
    },
    {
      title: "Add Investment",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <Space>
          <div onClick={() => handleEdit(record)} style={{ cursor: "pointer" }}>
          <PlusSquareOutlined />
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
            icon={<TeamOutlined />}
            title="Investments"
         
          />
        </Col>
      </Row>

      <Card>
        <Table
          style={{ minHeight: "100vh" }}
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            showSizeChanger: false,
            onChange: (page, pageSize) => getDepartments(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? "Edit Department" : "Add Department"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={650}
      >
           <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="mt-20"
      initialValues={{ investments: [{ name: "", date: null }] }}
    >
      <Form.List name="investments">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row gutter={16} key={key} align="middle">
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Investment Amount"
                    rules={[{ required: true, message: "Enter amount" }]}
                  >
                    <Input placeholder="Enter amount" size="large" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, "date"]}
                    label="Investment Date"
                    rules={[{ required: true, message: "Select date" }]}
                  >
                    <DatePicker style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                    danger
                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Row
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form.Item>
    </Form>

      </Modal>
    </DefaultLayout>
  );
};

export default Departments;

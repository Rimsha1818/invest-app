import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Row,
  Col,
  Space,
  Card,
  notification,
  Tag,
} from "antd";
import { TeamOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import formPermissionService from "../../services/formPermission";
import userService from "../../services/user";
import { useMediaQuery } from "react-responsive";

const { Option } = Select;

const AssignPermission = () => {
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState([]);

  const getUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {}
  };

  const getFormPermissions = async () => {
    try {
      setLoading(true);
      const response = await formPermissionService.getPermissions();
      setData(response);
      setGroups(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form permissions:", error);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the Assigned Permission?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await formPermissionService.deleteAssignedPermission(
            record.id
          );
          if (response.success) {
            notification.success({
              message: "Assigned Permission Deleted",
              description: response.message,
            });
            getAssignedPermission(currentPage);
          }
        } catch (error) {
          console.log(error);
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

  const getAssignedPermission = async (page = 1, itemsPerPage = 15) => {
    setLoading(true);
    await formPermissionService
      .getAssignedPermission(page, itemsPerPage)
      .then((response) => {
        console.log("response", response);
        setGroupPermissions(response);
        setCurrentPage(page);
        setTotalDataCount(response.total);
        setItemsPerPage(response.per_page);
        setLoading(false);
      });
  };

  useEffect(() => {
    getUsers();
    getFormPermissions();
    getAssignedPermission();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    console.log('record');
    console.log(record);
    console.log('record');
    setEditing(record);
    form.setFieldsValue({
      form_roles: record.form_roles.map((role) => role.id),
      user_id: record.id,
    });
    setIsModalVisible(true);
  };
  const dataSource =
    groupPermissions && typeof groupPermissions === "object"
      ? Object.keys(groupPermissions)
          .filter((key) => !isNaN(parseInt(key, 10)))
          .map((key) => ({
            ...groupPermissions[key],
            key: key,
            formattedRoles:
              groupPermissions[key].form_roles
                ?.map((role) => role.name)
                .join(", ") || "",
          }))
      : [];
  const onFinish = async (values) => {
    setLoading(true);

    try {
      if (editing) {
        const response = await formPermissionService.updateAssignedPermission(
          values.user_id,
          values
        );
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Assigned Permission Updated",
            description: response.message,
          });
          getAssignedPermission(currentPage);
        }
      } else {
        const response = await formPermissionService.postAssignedPermission(
          values
        );
        if (response.success) {
          setIsModalVisible(false);
          setEditing(null);
          form.resetFields();
          notification.success({
            message: "Assigned Permission Successfully",
            description: response.message,
          });
          getAssignedPermission(currentPage);
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
      title: "Assigned Groups",
      dataIndex: "formattedRoles",
      key: "roles",
    },
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Employee No",
      dataIndex: "employee_no",
      key: "employee_no",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: useMediaQuery({ minWidth: 768 }) ? "right" : null,
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
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<TeamOutlined />}
            title="Assign Permissions"
            right={
              <Button className="btn-blue" type="primary" onClick={showModal}>
                Assign Permission
              </Button>
            }
          />
        </Col>
      </Row>

      <Card>
        <Table
          scroll={{ x: 1000 }}
          style={{ minHeight: "100vh" }}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getAssignedPermission(page),
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editing ? "Edit Assigned Permission" : "Assign Permission"}
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
        >
          <Form.Item
            name="user_id"
            label="User"
            rules={[{ required: true, message: "Please select user" }]}
          >
            <Select
              showSearch={true}
              optionFilterProp="children"
              style={{ width: "100%" }}
              size="large"
            >
              {users &&
                users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="form_roles"
            label="Permission Group"
            rules={[
              { required: true, message: "Please select permission group" },
            ]}
          >
            <Select
              showSearch={true}
              optionFilterProp="children"
              style={{ width: "100%" }}
              size="large"
              mode="multiple"
            >
              {groups &&
                groups.map((group) => (
                  <Option key={group.id} value={group.id}>
                    {group.form_role_name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? "Save Changes" : "Assign Permission"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default AssignPermission;

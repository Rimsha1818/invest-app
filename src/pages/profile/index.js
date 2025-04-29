import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Card,
  notification,
  Skeleton,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import auth from "../../services/auth";
import userService from "../../services/user";
import Header from "../../components/header";
import DefaultLayout from "./../../components/layout/DefaultLayout";
import LocationComponent from "./../../components/location";
import DesignationComponent from "../../components/designation";
import DepartmentComponent from "./../../components/department/index";
import SectionComponent from "./../../components/section/index";
import "./index.css";

const Profile = () => {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const getCurrentUser = async () => {
    setLoading(true);
    await userService
      .getCurrentUser(currentUser.user_id)
      .then((response) => {
        setLoading(false);
        form.setFieldsValue({
          name: response.name,
          email: response.email,
          department_id: response.department.id,
          designation_id: response.designation.id,
          location_id: response.location.id,
          section_id: response.section.id,
          employee_type: response.employee_type,
          employee_no: response.employee_no,
          extension: response.extension,
          phone_number: response.phone_number,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: error.response,
        });
      });
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  const onFinish = async (values) => {
    setBtnLoading(true);
    try {
      const response = await auth.updateProfile(currentUser.user_id, values);
      if (response.success) {
        notification.success({
          message: "Profile Updated",
          description: response.message,
        });
      }
    } catch (error) {
      setBtnLoading(false);
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UserOutlined />}
            title="Update Profile"
            right={<></>}
          />
        </Col>
      </Row>

      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
          className="mt-20"
        >
          <Card title="Personal Information" className="mb-10">
            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                      { required: true, message: "Please enter the full name" },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Skeleton>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item name="email" label="Email">
                    <Input size="large" disabled />
                  </Form.Item>
                </Skeleton>
              </Col>
            </Row>

            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item
                    name="section_id"
                    label="Section"
                    rules={[
                      { required: true, message: "Please select a section" },
                    ]}
                  >
                    <SectionComponent all={true} />
                  </Form.Item>
                </Skeleton>
              </Col>

              <Col lg={12} md={12} sm={24} xs={24}>
                {loading ? (
                  <Skeleton paragraph={{ rows: 1 }} active /> // Show skeleton while loading
                ) : (
                  <Form.Item
                    name="department_id"
                    label="Department"
                    rules={[
                      { required: true, message: "Please select a department" },
                    ]}
                  >
                    <DepartmentComponent all={true} />
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item
                    name="designation_id"
                    label="Designation"
                    rules={[
                      {
                        required: true,
                        message: "Please select a designation",
                      },
                    ]}
                  >
                    <DesignationComponent all={true} />
                  </Form.Item>
                </Skeleton>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item
                    name="location_id"
                    label="Location"
                    rules={[
                      { required: true, message: "Please select a location" },
                    ]}
                  >
                    <LocationComponent all={true} />
                  </Form.Item>
                </Skeleton>
              </Col>
            </Row>

            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item
                    name="employee_type"
                    label="Employee Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select the employee type",
                      },
                    ]}
                  >
                    <Select
                      showSearch={true}
                      optionFilterProp="children"
                      size="large"
                    >
                      <Select.Option value="Permanent">Permanent</Select.Option>
                      <Select.Option value="Contract">Contract</Select.Option>
                    </Select>
                  </Form.Item>
                </Skeleton>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item
                    name="employee_no"
                    label="Employee No"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the employee number",
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Skeleton>
              </Col>
            </Row>

            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item name="extension" label="Extension">
                    <Input size="large" />
                  </Form.Item>
                </Skeleton>
              </Col>

              <Col lg={12} md={12} sm={24} xs={24}>
                <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
                  <Form.Item name="phone_number" label="Phone">
                    <Input size="large" />
                  </Form.Item>
                </Skeleton>
              </Col>
            </Row>
          </Card>

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item>
              <Button
              type="primary"
              block
              disabled={loading}
              loading={loading}
              className="btn-blue mr-20"
              onClick={() => {
                form.submit();
              }}
            >
              Update
            </Button>


              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </DefaultLayout>
  );
};

export default Profile;

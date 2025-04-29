import React, { useState, useEffect } from "react";
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
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import FormService from "../../services/form";

const { Option } = Select;

const Forms = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [initiators, setInitiators] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [formId, setFormId] = useState(null);
  const [isScrf, setIsScrf] = useState(false);

  const getForms = async (page = 1) => {
    setLoading(true);

    try {
      const response = await FormService.getForms(page);
      setData(response.data);
      setCurrentPage(page);
      setTotalDataCount(response.total);
      setItemsPerPage(response.per_page);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch forms:", error);
      setLoading(false);
    }
  };

  const getFormSetupFields = async (id) => {
    try {
      setLoading(true);
      const response = await FormService.getFormSetupFields();
      setInitiators(response);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch form setup fields:", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getForms();
    getFormSetupFields();
  }, []);

  const handleCancel = () => {
    getFormSetupFields();
    setIsModalVisible(false);
    setIsScrf(false);
    form.resetFields();
    // setLoading(false);
  };

  const filterInitiators = (record, initiators) => {
    let filteredInitiators = [...initiators];

    if (record.id !== 2 && record.id !== 6) {
        filteredInitiators = filteredInitiators.filter(
            (initiator) => initiator.id !== 1 && initiator.id !== 2
        );
    }

    if (record.id !== 6) {
        filteredInitiators = filteredInitiators.filter(
            (initiator) => initiator.id !== 7
        );
    }

    return filteredInitiators;
};

  const handleEdit = async (record) => {
    
    if (record.name === "SCRF" ) {
      setIsScrf(true);
      await getFormSetupFields();
      setLoading(false);
    }

    const filteredInitiators = filterInitiators(record, initiators);
    console.log('filteredInitiators',filteredInitiators)
    setInitiators(filteredInitiators);

    const {
      initiator_field_one_id,
      initiator_field_two_id,
      initiator_field_three_id,
      initiator_field_four_id,
      initiator_field_five_id,
      callback,
    } = record;

    const initiatorValues = {
      initiator_field_one_id,
      initiator_field_two_id,
      initiator_field_three_id,
      initiator_field_four_id,
      initiator_field_five_id,
    };

    form.setFieldsValue(initiatorValues);

    form.setFieldsValue({
      callback,
    });

    setFormId(record.id);
    setIsModalVisible(true);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await FormService.updateFormSetupFields(formId, values);

      if (response.success) {
        notification.success({
          message: "Updated",
          description: response.message,
        });

        setIsModalVisible(false);
        setLoading(false);
        getForms();
      }
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Form Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 40,
      render: (text, record) => (
        <Space>
          <div onClick={() => handleEdit(record)} style={{ cursor: "pointer" }}>
            <EditOutlined />
          </div>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<EditOutlined />} title="Workflow Structure" />
        </Col>
      </Row>

      <Card>
        <Table
          style={{ minHeight: "100vh" }}
          columns={columns}
          dataSource={data.map((item, index) => ({ ...item, key: item.id }))}
          loading={loading}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getForms(page),
          }}
        />
      </Card>

      <Modal
        title="Form Initiator"
        open={isModalVisible}
        onCancel={handleCancel}
        width={900}
        footer={null}
      >
        <Card title="Form conditional Initiator">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item name="initiator_field_one_id" label="Initiator One">
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    allowClear
                  >
                    {initiators &&
                      initiators.map((initiator) => (
                        <Option
                          key={initiator.id}
                          value={
                            initiator.id === initiators.initiator_field_one_id
                              ? initiator.id
                              : initiators.initiator_field_one_id
                          }
                        >
                          {initiator.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="initiator_field_two_id" label="Initiator Two">
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    allowClear
                  >
                    {initiators &&
                      initiators.map((initiator, index) => (
                        <Option
                          key={initiator.id}
                          value={
                            initiator.id === initiators.initiator_field_two_id
                              ? initiator.id
                              : initiators.initiator_field_two_id
                          }
                        >
                          {initiator.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name="initiator_field_three_id"
                  label="Initiator Three"
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    allowClear
                  >
                    {initiators &&
                      initiators.map((initiator, index) => (
                        <Option
                          key={initiator.id}
                          value={
                            initiator.id === initiators.initiator_field_three_id
                              ? initiator.id
                              : initiators.initiator_field_three_id
                          }
                        >
                          {initiator.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="initiator_field_four_id"
                  label="Initiator Four"
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    allowClear
                  >
                    {initiators &&
                      initiators.map((initiator, index) => (
                        <Option
                          key={initiator.id}
                          value={
                            initiator.id === initiators.initiator_field_four_id
                              ? initiator.id
                              : initiators.initiator_field_four_id
                          }
                        >
                          {initiator.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              {isScrf && (
                <Col span={12}>
                  <Form.Item
                    name="initiator_field_five_id"
                    label="Initiator Five"
                  >
                    <Select
                      showSearch={true}
                      optionFilterProp="children"
                      size="large"
                      allowClear
                    >
                      {initiators &&
                        initiators.map((initiator, index) => (
                          <Option
                            key={initiator.id}
                            value={
                              initiator.id ===
                              initiators.initiator_field_five_id
                                ? initiator.id
                                : initiators.initiator_field_five_id
                            }
                          >
                            {initiator.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}

              <Col span={12}>
                <Form.Item name="callback" label="Callback">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </DefaultLayout>
  );
};

export default Forms;

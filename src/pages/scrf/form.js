import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scrfService from '../../services/scrf';
import { useSelector } from 'react-redux';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  message,
  Row,
  Col,
  Card,
  Badge,
  notification,
  Upload,
  Spin,
} from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import categoryService from '../../services/category';
import DefaultLayout from '../../components/layout/DefaultLayout';
import LocationComponent from '../../components/location';

const { Option } = Select;

export default function ScrfForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrfLoading, setScrfLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDraft, setIsDraft] = useState(null);
  const [formFields, setFormFields] = useState([{ id: 1 }]);
  const { currentUser } = useSelector((state) => state.user);
  const defaultLocationId = currentUser ? currentUser.location.id : null;
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          getScrfDetails(id);
        } else {
          // Fetch initial categories and default subcategories
          await getCategories();
          const defaultCategoryId = defaultLocationId; // Assuming defaultLocationId holds a category
          if (defaultCategoryId) {
            await onCategoryChange(defaultCategoryId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchData();
  }, [id, defaultLocationId]);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      handleRemoveAttachment(file);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => {
        return prevFileList ? [...prevFileList, file] : [file];
      });
      return false;
    },
    fileList,
  };

  useEffect(() => {
    getCategories();
    //getBusinessexpert();
    addField();
  }, []);
  const handleSuccess = (message, description) => {
    console.log('message, description');
    setLoading(false);
    setUploading(false);

    setIsModalVisible(false);
    setEdit(null);
    form.resetFields();
    setFileList([]);

    notification.success({
      message,
      description,
    });

    navigate('/dashboard');
    setLoading(false);
    setUploading(false);

    setIsModalVisible(false);
  };

  const getCategories = async () => {
    let response;
    response = await categoryService.getAllCategories();
    setCategories(response);
  };

  const onCategoryChange = async (value) => {
    console.log(value)
    try {
      const response = await categoryService.getAllSubCategories(value);
      console.log(response)
      setSubCategories(response.data.software_subcategories);
    } catch (error) {
      console.error('Error while fetching subCategories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);


  const getScrfDetails = async (id) => {
    setScrfLoading(true);
    try {
      const record = await scrfService.getScrfDetails(id);
      console.log('result hai ', record);
      setEdit(record);

      const subCategoriesResponse = await categoryService.getAllSubCategories(record.software_category.id);
      setSubCategories(subCategoriesResponse.data.software_subcategories);

      console.log('result hai2 ', record.software_category.id);
      form.setFieldsValue({
        request_title: record.request_title,
        location_id: record.location.id,
        request_specs: record.request_specs,
        change_type: record.change_type,
        change_priority: record.change_priority,
        man_hours: record.man_hours,
        process_efficiency: record.process_efficiency,
        controls_improved: record.controls_improved,
        cost_saved: record.cost_saved,
        legal_reasons: record.legal_reasons,
        change_significance: record.change_significance,
        other_benefits: record.other_benefits,
        software_category_id: record.software_category.id,
        software_subcategory_id: record.software_subcategories.map(subcat => subcat.id),
        uat_scenarios: record.uatScenarios.map((scenario, index) => ({
          id: index,
          detail: scenario.detail,
          status: scenario.status,
        })),
      });
      console.log('result hai3 ', record.id);
      setFields(record.uatScenarios.map((_, index) => ({ id: index })));

      setFileList(
        record.attachments.map((attachment) => ({
          key: attachment.id,
          uid: attachment.id,
          name: attachment.original_title,
          status: 'done',
          url: attachment.filename,
        }))
      );

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setScrfLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setUploading(true);

    const { controls_improved, process_efficiency, cost_saved, legal_reasons } = values;
    if (isDraft == 'false') {
      if (!controls_improved && !process_efficiency && !cost_saved && !legal_reasons) {
        message.error('Please fill out at least one field Audit & Legal Requirement, Control Improvements, Business Process Change, Cost Saved');
        setLoading(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      for (const key in values) {
        if (Array.isArray(values[key])) {
          values[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item || '');
          });
        } else {
          formData.append(key, values[key] || '');
        }

        if (key === 'uat_scenarios') {
          values[key].forEach((uatScenario, index) => {
            formData.append(`uat_scenarios[${index}][detail]`, uatScenario.detail || '');
            formData.append(`uat_scenarios[${index}][status]`, uatScenario.status || '');
          });
        }
      }

      if (fileList) {
        fileList.forEach((file, index) => {
          if (!file.url) { // Check if the file is new
            formData.append(`attachments[${index}]`, file);
          }
        });
      }
      deletedAttachments.forEach((attachmentId, index) => {
        formData.append(`deleted_attachments[${index}]`, attachmentId);
      });
      // formData.append('deleted_attachments', JSON.stringify(deletedAttachments));
      formData.append(`save_as_draft`, isDraft);

      let response;
      if (edit && edit.id) {
        response = await scrfService.updateScrf(edit.id, formData);
      } else {
        response = await scrfService.postScrf(formData);
      }

      if (response.success) {
        handleSuccess('Software Change Request Form Added', response.message);
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    }
  };

  const handleRemoveAttachment = (file) => {
    setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
    console.log('file ',file);

    if (file.url) {
      setDeletedAttachments((prevDeleted) => [...prevDeleted, file.key]);
      console.log('send file.key  ',file.key);
    }
  };

  const addField = () => {
    const newField = {
      id: fields.length,
      details: '',
      status: '',
    };
    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFormFields([...formFields, { id: formFields.length + 1 }]);
  };

  const handleRemoveField = (id) => {
    const updatedFields = formFields.filter((field) => field.id !== id);
    setFormFields(updatedFields);
  };

  return (
    <DefaultLayout>
      <Spin spinning={scrfLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="mb-50"
        >
          <Card title="Basic Details">
            <Row gutter={[24, 24]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Request Title"
                  name="request_title"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the request title',
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="location_id"
                  label="Location"
                  rules={[
                    { required: true, message: 'Please select a location' },
                  ]}
                  initialValue={defaultLocationId}

                >

                  <LocationComponent all={true} />
                </Form.Item>

              </Col>
            </Row>

            <Row gutter={24}>
              <>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item name="software_category_id" label="Category">
                    <Select
                      showSearch={true}
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Please Select Category"
                      onChange={onCategoryChange}
                      allowClear
                    >
                      {categories &&
                        categories.map((category) => (
                          <Select.Option key={category.id} value={category.id}>
                            {category.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

                {subCategories.length > 0 && (
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item name="software_subcategory_id" label="Subcategory">
                      <Select
                        showSearch={true}
                        optionFilterProp="children"
                        placeholder="Subcategory"
                        allowClear={true}
                        mode="multiple"
                        size="large"
                      >
                        {subCategories.map((subCategory) => (
                          <Select.Option key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </>
            </Row>
            <Row gutter={[16, 15]}>
              <Col span={24}>
                <Form.Item
                  label="Request Specs & Business Justification"
                  name="request_specs"
                // rules={[
                //   { required: true, message: 'Please provide justification' },
                // ]}
                >
                  <Input.TextArea rows={10} />
                </Form.Item>
              </Col>

              <Col span={24} className="mb-40">
                <Upload.Dragger multiple {...props} onRemove={(file) => handleRemoveAttachment(file)} >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to this area to upload
                  </p>
                </Upload.Dragger>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Change Type"
                  name="change_type"
                // rules={[
                //   { required: true, message: 'Please select change type' },
                // ]}
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    placeholder="Please select"
                  >
                    <Option value="Modification">Modification</Option>
                    <Option value="Correction"> Correction </Option>
                    <Option value="New Enhancement  / Addition">
                      New Enhancement / Addition
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Change Priority"
                  name="change_priority"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please select change priority',
                //   },
                // ]}
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    placeholder="Please select"
                  >
                    <Option value="Severe">Severe</Option>
                    <Option value="Normal">Normal</Option>
                    <Option value="Urgent">Urgent</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Change Significance"
                  name="change_significance"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please select change significance',
                //   },
                // ]}
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    placeholder="Please select"
                  >
                    <Option value="Major">Major</Option>
                    <Option value="Minor">Minor</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Man hours saving"
                  name="man_hours"
                  rules={[
                    {
                      required: true,
                      message: "Required Field",
                    },
                    {
                      pattern: /^[0-9]*$/,
                      message: "Only Numbers",
                    },
                  ]}
                >
                  <Input
                    size='large'
                    style={{ width: '100%' }}
                    placeholder='Please type numeric value'
                  />
                </Form.Item>
              </Col>

            </Row>
          </Card>

          <Card title="Additional Details">
            <Row gutter={[24, 24]}>


              <Col lg={24} md={24} sm={24}>
                <Form.Item
                  label="Audit & Legal Requirement"
                  name="legal_reasons"
                >
                  <Input.TextArea rows={7} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label="Control Improvements"
                  name="controls_improved"
                >
                  <Input.TextArea rows={7} />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label="Business Process Change"
                  name="process_efficiency"
                >
                  <Input.TextArea rows={7} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[12, 12]}>
              <Col lg={12} md={12} sm={12}>
                <Form.Item label="Cost Saved" name="cost_saved">
                  <Input.TextArea rows={7} />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <Form.Item label="Other Benefits" name="other_benefits">
                  <Input.TextArea rows={7} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="UAT Details">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    title={
                      <span>
                        <Badge
                          style={{ marginTop: '-3px' }}
                          color="#2d77fa"
                          count={index + 1}
                        />{' '}
                        Define UAT Senario
                      </span>
                    }
                    className="mb-7"
                  >
                    <Row
                      gutter={[12, 12]}
                      key={field.id}
                      style={{ display: 'flex', marginBottom: 34 }}
                    >
                      <Col span={16}>
                        <Form.Item
                          name={['uat_scenarios', field.id, 'detail']}
                          label="Scenario"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please type scenario details',
                        //   },
                        // ]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={['uat_scenarios', field.id, 'status']}
                          label="Result Status"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please select status',
                        //   },
                        // ]}
                        >
                          <Select
                            showSearch={true}
                            optionFilterProp="children"
                            size="large"
                          >
                            <Option value="Pass">Passed</Option>
                            <Option value="Fail">Failed</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        {field.id === 0 ? null : (
                          <Button
                            style={{ marginTop: '27px' }}
                            size="large"
                            onClick={() => removeField(field.id)}
                          >
                            -
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item
                  className="textRight"
                  style={{ marginRight: '10px' }}
                >
                  <Button
                    type="dashed"
                    onClick={addField}
                    icon={<PlusOutlined />}
                  >
                    Add UAT Scenarios
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="mt-24"
          >
            <Button
              type="primary"
              block
              disabled={loading}
              loading={loading}
              className="btn-blue mr-20"
              onClick={() => {
                setIsDraft(false);
                form.submit();
              }}
            >
              Save & Publish
            </Button>

            <Button
              loading={loading}
              disabled={loading}
              type="primary"
              onClick={() => {
                setIsDraft(true);
                form.submit();
              }}
            >
              Save Draft
            </Button>
          </div>
        </Form>
      </Spin>
    </DefaultLayout>
  );
}

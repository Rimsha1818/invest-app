import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Card,
  message,
  Select,
  Upload,
  notification,
  Spin,
  Typography,
  Tag,
} from 'antd';
import { SafetyCertificateOutlined, UploadOutlined } from '@ant-design/icons';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
// import roleService from '../../services/role';
import scrfService from '../../services/scrf';
import qaService from '../../services/qualityAssurance';
// import UserComponent from './../../components/user/index';
import FormListComponent from './../../components/formList/index';
// import TaskComponent from '../../components/task';
import { useSelector } from 'react-redux';
// import env from '../../env';
import Meta from 'antd/es/card/Meta';

export default function QualityAssuranceForm() {

  const { currentUser } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [formId, setFormId] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDraft, setIsDraft] = useState(null);
  const location = useLocation();
  const [uatScenarios, setUatScenarios] = useState([]);
  const [key, setKey] = useState(null);
  const [detailParam, setDetailParam] = useState(null);
  // const [users, setUsers] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [taskDetail, setTaskDetail] = useState(null);
  const [urlParams, setUrlParams] = useState(null);

  // const getSrcFromFile = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file.originFileObj);
  //     reader.onload = () => resolve(reader.result);
  //   });
  // };

  // const onPreview = async (file) => {
  //   const src = file.url || (await getSrcFromFile(file));
  //   const imgWindow = window.open(src);

  //   if (imgWindow) {
  //     const image = new Image();
  //     image.src = src;
  //     imgWindow.document.write(image.outerHTML);
  //   } else {
  //     window.location.href = src;
  //   }
  // };

  // const getBase64 = (img, callback) => {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
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
  // const props = {
  //   name: 'file',
  //   action: `${env.API_URL}/attachments`,
  //   method: 'post',
  //   multiple: true,
  //   accept: '.jpg,.jpeg,.png,.gif',
  //   showUploadList: true,
  //   listType: "picture",
  //   className: "upload-list-inline",
  //   onPreview: onPreview,
  //   headers: {
  //     authorization: `Bearer ${currentUser.token}`,
  //     'Content-Type': 'multipart/form-data',
  //   },
  //   data: {
  //     form_id: formId,
  //     key: key,
  //   },
  //   onChange(info) {
  //     const { status } = info.file;

  //     if (status === 'uploading') {
  //     } else if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //       getBase64(info.file.originFileObj, (url) => {
  //       });
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onPreview: onPreview,
  // };

  // console.log(props)

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const detailParam = urlParams.get('detail');

    if (detailParam) {
      fetchQaAssignment(detailParam);
    } else {
      // Handle cases where 'detail' is not provided
      message.error('Task detail not found.');
      navigate('/dashboard');
    }
  }, [location.search, navigate]);

  const fetchQaAssignment = async (detail) => {
    setLoading(true);
    try {
      const response = await qaService.getifQaAssigned(detail);
      if (response) {
        setFormId(response.form_id);
        setTaskId(response.record.id);
        setUatScenarios(response.record.uat_scenarios || []);
        setData(response);
        console.log('detail ', response );
      } else {
        message.error('You are not assigned to this task.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error fetching QA assignment:", error);
      notification.error({
        message: 'Error',
        description: error.response ? error.response.data.message : "An error occurred",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    form.setFieldsValue({
      form_id: formId,
      key: key,
      // assigned_to_ids: users,
    });
  }, [formId, key]);
  const handleSuccess = (message, description) => {
    setLoading(false);
    notification.success({
      message,
      description,
    });
    navigate('/dashboard');
  };


  const onFinish = async (values) => {
    setLoading(true);
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
      }

      if (fileList) {
        fileList.forEach((file, index) => {
          if (!file.url) {
            formData.append(`attachments[${index}]`, file);
          }
        });
      }
      formData.append(`form_id`, parseInt(formId, 10));
      formData.append(`key`, parseInt(taskId, 10));
      formData.append(`save_as_draft`, isDraft);

      let response;
      if (data && data.id) {
        response = await qaService.updateQAStatus(data.id, formData);
      } else {
        response = await qaService.postQA(formData);
      }

      if (response.success) {
        handleSuccess('Quality Assurance Request Form Added', response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      notification.error({
        message: 'Error',
        description: error.response ? error.response.data.message : "An error occurred", // Check for error.response
      });
    } finally {
      setLoading(false);
    }
  };

  if (!loading && !data) {
    return navigate('/dashboard');
  }
  return (
    <DefaultLayout>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Header
              icon={<SafetyCertificateOutlined />}
              title="Quality Assurance"
            />
          </Col>
        </Row>
        {data && data.record ? (
        <Card style={{ height: '100vh' }}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="mt-20"
          >
            {/* <Form.Item
              name="form_id"
              label="Form"
              rules={[{ required: true, message: 'Please select Form' }]}
              hidden
            >
              <FormListComponent
                disabled
                selectedFormId={formId}
                onChange={(value) => {
                  form.resetFields(['key', 'team_ids']);
                  setFormId(value);
                }}
              />
            </Form.Item> */}
              <Meta style={{marginBottom:'10px', marginLeft:'10px'}} title={`${data.record.request_title} (${data.record.sequence_no})`} description={data.form_name ?? ''} />
            {/* {formId ? (
                <Form.Item
                  name="key"
                  label="Select Task"
                  rules={[{ required: true, message: 'Please select Task' }]}
                >
                  <Select defaultValue={data.record.id}/>
                </Form.Item>
            ) : null} */}

            {/* <Form.Item
              name="assigned_to_ids"
              label="Users"
            >
              <UserComponent mode="multiple" selectedUsers={users} disabled />
            </Form.Item> */}

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select Status' }]}
            >
              <Select size="large" placeholder="Select Status">
                <Select.Option value="Testing Ok">Testing Ok</Select.Option>
                <Select.Option value="Modification Required">Modification Required</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="feedback"
              label="Feedback"
              rules={[{ required: true, message: 'Please provide feedback' }]}
            >
              <Input.TextArea rows={4} placeholder="Type your feedback" />
            </Form.Item>

             {formId === 2 && (

              <Card 
                title={<Typography.Title level={5} style={{ marginBottom: '0' }}>UAT Scenarios</Typography.Title>} 
                className="mb-20" 
                style={{ borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '20px' }}
              >
                {uatScenarios.map((scenario, index) => (
                  <Row key={scenario.id} gutter={[24, 24]} className="mb-20">
                    <Col span={12}>
                      <Typography.Text strong style={{ fontSize: '16px', color: '#333' }}>
                        Scenario {index + 1}:
                      </Typography.Text>
                      <Typography.Paragraph style={{ fontSize: '14px', lineHeight: '1.6', color: '#555', marginTop: '8px' }}>
                        <Tag style={{width:'100%'}}>{scenario.detail}</Tag>
                      </Typography.Paragraph>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={`uat_options[${index}]`}
                        label={<span style={{ fontWeight: 'bold', color: '#333' }}>UAT Respond</span>}
                        rules={[{ required: true, message: 'Please select UAT Respond' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Select 
                          size="large" 
                          placeholder="Select UAT Respond" 
                          style={{
                            borderRadius: '8px', 
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', 
                            // padding: '8px'
                          }}
                        >
                          <Select.Option value="Testing Result OK">Testing Result OK</Select.Option>
                          <Select.Option value="Testing Not Successful">Testing Not Successful</Select.Option>
                          <Select.Option value="Not Relevant">Not Relevant</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </Card>
            )}

            <Form.Item
              name="attachment"
              label="Attachment"
            >
              <Upload {...props} >
              <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

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
        </Card>
        ) : (
          <div>Loading task details...</div>
        )}
      </Spin>
    </DefaultLayout>
  );
}

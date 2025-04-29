import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  message,
  Col,
  Card,
  notification,
  Tabs,
  Upload,
} from 'antd';
import {
  MinusCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/user';
import equipmentService from '../../services/equipments';
import equipmentRequestService from '../../services/equipmentRequest';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import './index.css';
import InventoryAssetComponent from '../../components/InventoryAsset';
import EquipmentCalculatComponent from '../../components/EquipmentCalculate';
import CostCenterComponent from '../../components/costCenter';
import DepartmentComponent from '../../components/department';
import ServiceComponent from '../../components/service';
import TeamComponent from '../../components/team';

import CompanyComponent from '../../components/company';

import SdfPriorityComponent from '../../components/sdfPriority';
import supportDeskService from '../../services/supportDesk';


import depServices from '../../services/depServices';
import serviceTeams from '../../services/serviceTeams';


const PostSupportDesk = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingEquipmentRequest, setEditingEquipmentRequest] = useState(null);
  const [isDraft, setIsDraft] = useState(null);
  const defaultLocationId = currentUser ? currentUser.location.id : null;
  const defaultDeparmentId = currentUser ? currentUser.department.id : null;
  // const defaultCompanyId = currentUser ? currentUser.department.id : null;

  const { TabPane } = Tabs;
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [editInvMode, setEditInvMode] = useState(false);
  const [serviceIds, setServiceIds] = useState(null);
  const [teamIds, setTeamIds] = useState(null);

  const [serviceData, setServiceData] = useState(null);
  const [teamData, setTeamData] = useState(null);

  

  const { id } = useParams();
  const navigate = useNavigate();

  const handleRequirementChange = (index, values) => {
    setSelectedCheckboxes((prev) => {
      const newCheckboxes = [...prev];
      newCheckboxes[index] = values;
      return newCheckboxes;
    });
  };

const handleDepartmentChange = async (valuee) => {
  try {
    const depServicesRes = await depServices.getServicesByDep(valuee);
    setServiceData(depServicesRes.services);
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};

const handleServiceChange = async (valuee) => {
  try {
    const serviceTeamsRes = await serviceTeams.getTeamsByService(valuee);
    setTeamData(serviceTeamsRes.teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }

    setServiceIds(valuee); 
  };
  const handleTeamChange = (values) => {
    setTeamIds(values); 
  };


  useEffect(() => {
    const fetchData = async () => {
      try {

        if (id) {
          setLoading(true);
          setEditMode(true);

          const response = await supportDeskService.getSupportDeskById(id);
            setLoading(false);

            // const plantIds = response.data.plant.map(item => item.id)
            // setSelectedPlants(plantIds.map(item => Number(item)))

           form.setFieldsValue({
              request_title: response.data.request_title,
              relevant_id: response.data.relevant_id,
              // company_id: response.company_id,
              // type: response.type,
              // relevant_id: response.relevant_id,
              // roles_required: response.roles_required,
              // tcode_required: response.tcode_required,
              // plant: plantIds,
              // business_justification: response.business_justification,

            });

          
        }
      } catch (error) {
        if (error.response?.status === 500) {
          // navigate('/sap-access-form');
        } else {
          console.log(error);
          notification.error({
            message: 'Error fetching SAP Access Form',
            description: error.message,
          });
        }
      }
    };

    fetchData();
  }, [id, form]);



  // For Image
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
  const handleRemoveAttachment = (file) => {
    setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
    console.log('file ',file);

    if (file.url) {
      setDeletedAttachments((prevDeleted) => [...prevDeleted, file.key]);
      console.log('send file.key  ',file.key);
    }
  };



 
  // const onFinish = async (values) => {
  //   try {
  //     values.save_as_draft = String(isDraft);
  //     //console.log(values)
     
  //     const formattedData = {
  //       ...values, 
  //       save_as_draft: 'false',
  //     };
  //     //console.log(JSON.stringify(formattedData))

  //     if (editMode) {
  //       // const response = await equipmentRequestService.updateEquipmentRequest(
  //       //   editingEquipmentRequest.id,
  //       //   formattedData
  //       // );

  //       // if (response.success) {
  //       //   setEditMode(false);
  //       //   setEditingEquipmentRequest(null);
  //       //   notification.success({
  //       //     message: 'Equipment Updated',
  //       //     description: response.message,
            
  //       //   });
  //       //   navigate('/support-desk-form');
  //       // }
  //     } else {
  //       const response = await supportDeskService.postSupportDesk(
  //         formattedData
  //       );

  //       if (response.success) {
  //         form.resetFields();
  //         notification.success({
  //           message: 'Request Support Added',
  //           description: response.message,
  //         });
  //         navigate('/support-desk-form');
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     notification.error({
  //       message: 'Request Support Operation Failed',
  //       description: error.response.data.message,
  //     });
  //   }
  // };

const onFinish = async (values) => {
  try {
    values.save_as_draft = String(isDraft);

    // Prepare FormData to include attachments and other form data
    const formData = new FormData();

    // Append form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays by appending each element individually
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value);
      }
    });

    // Handle attachments if present
    if (fileList) {
      fileList.forEach((file, index) => {
        if (!file.url) { // Check if the file is new
          formData.append(`attachments[${index}]`, file);
        }
      });
    }

    // Handle deleted attachments
    if (deletedAttachments) {
      deletedAttachments.forEach((attachmentId, index) => {
        formData.append(`deleted_attachments[${index}]`, attachmentId);
      });
    }

    if (editMode) {
      // Your update logic here
    } else {
      const response = await supportDeskService.postSupportDesk(formData);

      if (response.success) {
        form.resetFields();
        notification.success({
          message: 'Request Support Added',
          description: response.message,
        });
        navigate('/support-desk-form');
      }
    }
  } catch (error) {
    console.error(error);
    notification.error({
      message: 'Request Support Operation Failed',
      description: error.response?.data?.message || 'An unexpected error occurred',
    });
  }
};



  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FileTextOutlined />} title="Request Support Form" />
        </Col>
      </Row>
      <Card>
        <Form
          autoComplete="off"
          onFinish={onFinish}
          form={form}
          layout="vertical"
          scrollToFirstError
          className="mt-20"
        >
          <div spinning={loading}>
           

            <Card size="small" className="mb-10" title="Add Request Support">
              <Row gutter={[12, 12]}>
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="request_title"
                    label="Request Title"
                    rules={[{ required: true, message: 'Type Request Title' }]}
                  >
                    <Input placeholder="Type Request Title" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="relevant_id"
                    label="Relevant ID"
                        // rules={[{ required: true, message: 'Please select a Relevant ID' }]}
                  >
                    <Input
                      placeholder="Type Relevant ID:"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please select a Priority' }]}
                  >
                    <SdfPriorityComponent/>
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={[12, 12]}>
              
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                  name="department_id"
                  label="Service Required From Department"
                  // initialValue={defaultDeparmentId}
                  rules={[
                    { required: true, message: 'Please select a Service Required From Department' },
                  ]}>
                
                    <DepartmentComponent onChange={handleDepartmentChange} />
                </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                  name="service_id"
                  label="Service Required"
                  // initialValue={defaultDeparmentId}
                  rules={[
                    { required: true, message: 'Please select a Service' },
                  ]}>
                    <ServiceComponent  onChange={handleServiceChange}  datas={serviceData} byDep={true} />
                </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                  name="team_ids"
                  label="Team Required"
                  // initialValue={defaultDeparmentId}
                  rules={[
                    { required: true, message: 'Please Team Required' },
                  ]}>
                
                    <TeamComponent  onChange={handleTeamChange} multi={true}  datas={teamData} byDep={true}/>
                </Form.Item>
                </Col>
                

                
              </Row>

              <Row gutter={[12, 12]}>
              <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="phone"
                    label="Extension / Phone"
                        rules={[{ required: true, message: 'Please select a Extension / Phone' }]}
                  >
                    <Input
                      placeholder="Type Extension / Phone:"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                 <Form.Item
                    name="description"
                    label="Description"
                    // rules={[{ required: true, message: 'Type Business Justification' }]}
                  >
                    <Input.TextArea
                      rows={4}
                      size="large"
                      placeholder={`Enter Description`}
                    />
                  </Form.Item>
                </Col>
               
                
              </Row>

            </Card>


  

           {/* ATTACHMENT */}
           <Card size="small" className="mb-10" title="Attachment(s)">
              <Row gutter={[12, 12]}>
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
            </Card>
            {/* ATTACHMENT */}

            <Row gutter={[12, 12]} className="mt-40">
              <Col span={24} className="text-right">
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
                      disabled={loading} 
                        loading={loading}
                        type="primary"
                        onClick={() => {
                          setIsDraft(true);
                          form.submit();
                        }}
                      >
                        Save Draft
                      </Button>

                </div>
              </Col>
            </Row>
          </div>
        </Form>
      </Card>
    </DefaultLayout>
  );
};

export default PostSupportDesk;

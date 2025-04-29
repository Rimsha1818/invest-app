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

import sapService from '../../services/sap';

import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import './index.css';
import InventoryAssetComponent from '../../components/InventoryAsset';
import EquipmentCalculatComponent from '../../components/EquipmentCalculate';
import SapLocationComponent from '../../components/sapLocation';
import CostCenterComponent from '../../components/costCenter';
import DepartmentComponent from '../../components/department';
import SapTypeComponent from '../../components/sapType';
import SapPlantComponent from '../../components/sapPlant';
import CompanyComponent from '../../components/company';
import ParamComponent from '../../components/param';

// import { Editor } from '@tinymce/tinymce-react';
const PostEquipmentRequest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingEquipmentRequest, setEditingEquipmentRequest] = useState(null);
  const [isDraft, setIsDraft] = useState(null);
  const defaultLocationId = currentUser ? currentUser.location.id : null;
  const defaultDeparmentId = currentUser ? currentUser.department.id : null;

  const compId = currentUser && currentUser.company ? currentUser.company.id : 1;
  // const defaultCompanyId = currentUser ? currentUser.department.id : null;

  const { TabPane } = Tabs;
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);

  const [editInvMode, setEditInvMode] = useState(false);



  const { id } = useParams();
  const navigate = useNavigate();

  const [companyId, setCompanyId] = useState(null);

  const handleRequirementChange = (index, values) => {
    setSelectedCheckboxes((prev) => {
      const newCheckboxes = [...prev];
      newCheckboxes[index] = values;
      return newCheckboxes;
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {

        if (id) {
          setLoading(true);
          setEditMode(true);

          const response = await sapService.getSapById(id);
            setLoading(false);
          console.log('result hai ', response);


            if(response.type == "Modification"){
              setIsModification(true);
            }
            
              
            const locationIds = response.data.location.map(item => item.id)
            const plantIds = response.data.plant.map(item => item.id)
            setSelectedLocations(locationIds.map(item => Number(item)))
            setSelectedPlants(plantIds.map(item => Number(item)))

            setCompanyId(response?.company_id)

            // console.log('locationIds')
            // console.log(locationIds)
            // console.log(locationIds.map(item => Number(item)))
            // console.log('locationIds')
            const intLoc = locationIds.map(item => Number(item));
           form.setFieldsValue({
              request_title: response.request_title,
              company_id: response.company?.id,
              location: intLoc,
              type: response.type,
              sap_id: response.sap_id,
              roles_required: response.roles_required,
              tcode_required: response.tcode_required,
              plant: plantIds,
              business_justification: response.business_justification,

              sales_distribution: [
                {
                  sales_organization: response.data.sales_distribution[0]?.sales_organization || '',
                  distribution_channel: response.data.sales_distribution[0]?.distribution_channel || '',
                  division: response.data.sales_distribution[0]?.division || '',
                  sales_office: response.data.sales_distribution[0]?.sales_office || '',
                  sales_group: response.data.sales_distribution[0]?.sales_group || '',
                  other_details: response.data.sales_distribution[0]?.other_details || '',
                },
              ],

              material_management: [
                {
                  purchasing_org: response.data.material_management[0]?.purchasing_org || '',
                  purchasing_group: response.data.material_management[0]?.purchasing_group || '',
                  storage_location: response.data.material_management[0]?.storage_location || '',
                  purchasing_document: response.data.material_management[0]?.purchasing_document || '',
                  movement_type: response.data.material_management[0]?.movement_type || '',
                  other_details: response.data.material_management[0]?.other_details || '',
                },
              ],

              plant_maintenance: [
                {
                  planning_plant: response.data.plant_maintenance[0]?.planning_plant || '',
                  maintenance_plant: response.data.plant_maintenance[0]?.maintenance_plant || '',
                  work_centers: response.data.plant_maintenance[0]?.work_centers || '',
                  other_details: response.data.plant_maintenance[0]?.other_details || '',
                },
              ],

              financial_accounting_costing: [
                {
                  profile_center: response.data.financial_accounting_costing[0]?.profile_center || '',
                  cost_center: response.data.financial_accounting_costing[0]?.cost_center || '',
                  other_details: response.data.financial_accounting_costing[0]?.other_details || '',
                },
              ],

              production_planning: [
                {
                  other_details: response.data.production_planning[0]?.other_details || '',
                },
              ],

              human_resource: [
                {
                  personnel_area: response.data.human_resource[0]?.personnel_area || '',
                  sub_area: response.data.human_resource[0]?.sub_area || '',
                  cost_center: response.data.human_resource[0]?.cost_center || '',
                  employee_group: response.data.human_resource[0]?.employee_group || '',
                  employee_sub_group: response.data.human_resource[0]?.employee_sub_group || '',
                  other_details: response.data.human_resource[0]?.other_details || '',
                },
              ],
            });

            setFileList(
              response.attachments.map((attachment) => ({
                key: attachment.id,
                uid: attachment.id,
                name: attachment.original_title,
                status: 'done',
                url: attachment.filename,
              }))
            );

          
        }
      } catch (error) {
        if (error.response?.status === 500) {
          navigate('/sap-access-form');
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


  // SAP ID CONDITION
  const [isModification, setIsModification] = useState(false);

  const handleSapTypeChange = (value) => {
    setIsModification(value === "Modification");

    if (value === "Modification") {
      form.setFields([
        {
          name: 'sap_current_id',
          errors: [],
        },
      ]);
    } else {
      form.setFieldsValue({ sap_current_id: undefined });
    }
  };
  // SAP ID CONDITION

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

   


  // For Location
  const locationOptions = [
    { id: 1, name: "Head Office" },
    { id: 2, name: "Karachi Plant" },
    { id: 3, name: "Pezu Plant" },
    { id: 4, name: "Area Office" },
    { id: 5, name: "Islamabad" },
    { id: 6, name: "Lahore" },
    { id: 7, name: "Peshawar" },
    { id: 8, name: "Multan" },
    { id: 9, name: "Faisalabad" },
    { id: 10, name: "Quetta" },
];
  const handleLocationChange = (values) => {
    // console.log('locationOnchange');
    // console.log(values);
    // console.log('locationOnchange');
    setSelectedLocations(values); 
  };

  // For Plant
  
  const plantOptions = [
  { id: 1, name: "PIBT" },
  { id: 2, name: "QICT" },
  { id: 3, name: "LCHO" },
  { id: 4, name: "LCKP" },
  { id: 5, name: "LCPZ" },
  { id: 6, name: "LKPT" },
  { id: 7, name: "PKGP" },
  { id: 8, name: "PGPZ" },
];
  const handlePlantChange = (values) => {
    // const valupdplant = values.map((id) => ({
    //   id: parseInt(id, 10), // Convert string to integer
    //   name: plantOptions.find((option) => option.id === parseInt(id, 10))?.name,
    // }));
    setSelectedPlants(values);
  };

  // For Validation OF Sections
  const validateAtLeastOneField = async (_, value) => {
    const allValues = form.getFieldsValue();
    const filledFields = Object.values(allValues).filter((v) => v);
    if (filledFields.length === 0) {
      // return Promise.reject(new Error('At least one field must be filled!'));
      message.error('Please fill out at least one tab (SD, MM,, PM, FICO, PP, or HR)');
        return;
    }
    return Promise.resolve();
  };

  const convertAssetDetailsToString = (assetDetailsArray) => {
    return JSON.stringify(assetDetailsArray.map(assetDetail => ({
      request_type: assetDetail.request_type,
      action: assetDetail.action,
      inventory_status: assetDetail.inventory_status,
      qty_inventory: assetDetail.qty_inventory,
      expected_expense: assetDetail.expected_expense,
      serial_no: assetDetail.serial_no,
      asset_code: assetDetail.asset_code,
      description: assetDetail.description,
      remarks: assetDetail.remarks,
    })));
  };
  const onFinish = async (values) => {

    const { sales_distribution, material_management, plant_maintenance, financial_accounting_costing, production_planning, human_resource } = values;
    if (
      ( (!sales_distribution ) || (sales_distribution.length === 0) ) &&
      ( (!material_management ) || (material_management.length === 0) ) &&
      ( (!plant_maintenance ) || (plant_maintenance.length === 0) ) &&
      ( (!financial_accounting_costing ) || (financial_accounting_costing.length === 0) ) &&
      ( (!production_planning ) || (production_planning.length === 0) ) &&
      ( (!human_resource ) || (human_resource.length === 0) )
      ){
        message.error('Please fill out at least one tab (SD, MM,, PM, FICO, PP, or HR)');
        return;
      }

    try {
      values.save_as_draft = String(isDraft);
      
      
      const formattedData = {
        ...values, 
        location: selectedLocations.map((id) => ({
          id,
          name: locationOptions.find((option) => option.id === id)?.name,
        })),
        plant: selectedPlants.map((id) => ({
          id,
          name: plantOptions.find((option) => option.id === id)?.name,
        })),
        sap_id: values.type === "New" ? '1' : values.sap_id,
        save_as_draft: values.save_as_draft,
        attachments: fileList
          ? fileList
              .filter((file) => !file.url) 
              .map((file) => file) 
          : [],
        deleted_attachments: deletedAttachments,

      };

      // const formattedData = new FormData();
      // for (const key in values) {
      //   if (Array.isArray(values[key])) {
      //     values[key].forEach((item, index) => {
      //       formattedData.append(`${key}[${index}]`, item || '');
      //     });
      //   } else {
      //     formattedData.append(key, values[key] !== undefined ? String(values[key]) : ''); // Ensure all values are strings
      //   }
      // }

   
      // Append location as an array
      // selectedLocations.forEach((id, index) => {
      //   formattedData.append(`location[${index}][id]`, id);
      //   formattedData.append(`location[${index}][name]`, locationOptions.find((option) => option.id === id)?.name || '');
      // });

      // Append plant as an array
      // selectedPlants.forEach((id, index) => {
      //   formattedData.append(`plant[${index}][id]`, id);
      //   formattedData.append(`plant[${index}][name]`, plantOptions.find((option) => option.id === id)?.name || '');
      // });

   

      // Ensure sap_id is a string and provide a default if necessary
      // formattedData.append('sap_id', values.type === 'New' ? '1' : String(values.sap_id || ''));

      // Ensure isDraft is converted to a string (if boolean)
      // formattedData.append('save_as_draft', String(isDraft));

      // if (fileList) {
      //   fileList
      //     .filter((file) => !file.url) // Only new files
      //     .forEach((file, index) => {
      //       formattedData.append(`attachments[${index}]`, file); // Append each file
      //     });
      // }

      // deletedAttachments.forEach((attachmentId, index) => {
      //   formattedData.append(`deleted_attachments[${index}]`, attachmentId); // Append deleted attachments
      // });

      // console.log(formattedData)

      if (editMode) {
        const response = await sapService.updateSapForm(
          id,
          formattedData
        );

        if (response.success) {
          setEditMode(false);
          setEditingEquipmentRequest(null);
          notification.success({
            message: 'Sap Access Form Updated',
            description: response.message,
            
          });
          navigate('/sap-access-form');
        }
      } else {
        const response = await sapService.postSapRequest(
          formattedData
        );

        if (response.success) {
          form.resetFields();
          notification.success({
            message: 'Sap Access Form Added',
            description: response.message,
          });
          navigate('/sap-access-form');
        }
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Sap Access Form Operation Failed',
        description: error.response.data.message,
      });
    }
  };

 

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await userService.getCurrentUser(currentUser.user_id);
      //console.log(response);
      form.setFieldsValue({
        name: response.name,
        email: response.email,
        designation_id: response.designation.name,
        employee_no: response.employee_no,
        employee_type: response.employee_type,
        extension: response.extension,
        phone_number: response.phone_number,
        profile_location: response.location.name,
        role_id: response.roles.map((role) => role.id),
        // department_id: response.department.name,
        section_id: response.section.name,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const validateCheckboxGroup = (_, values) => {
    if (values && values.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please select at least one requirement.'));
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

const handleEditorChange = (content) => {
    console.log('Content:', content);
  };
  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FileTextOutlined />} title="SAP Access Form" />
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
           

            <Card size="small" className="mb-10" title="To be filled by Requestor">
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
                      name="company_id"
                      label="Company"
                      rules={[
                        {
                          required: true,
                          message: 'Please select a Company',
                        },
                      ]}
                    >
                      <CompanyComponent all={true}  />
                    </Form.Item>
                </Col>

                <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="location"
                  label="Location"
                  // rules={[
                  //   { required: true, message: 'Please select a location' },
                  // ]}
                >
                    <SapLocationComponent
                      value={selectedLocations}
                      onChange={handleLocationChange}
                    />;
                </Form.Item>
              </Col>

              </Row>
              <Row gutter={[12, 12]}>
              
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: 'Please select a Type' }]}
                  >
                    <SapTypeComponent onChange={handleSapTypeChange} />
                  </Form.Item>
                </Col>

                {isModification && (
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="sap_id"
                      label="Current SAP ID:"
                      rules={[
                        ...(isModification
                          ? [{ required: true, message: 'Type Current SAP ID:' }]
                          : []),
                      ]}
                    >
                      <Input
                        placeholder="Type Current SAP ID:"
                        size="large"
                        disabled={!isModification}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>

            </Card>

            <Card size="small" className="mb-10" title="Required ID & Access on Module(s)">
              <Row gutter={[12, 12]}>
                

                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="roles_required"
                    label="Roles Required"
                    // rules={[{ required: true, message: 'Type Roles Required:' }]}
                  >
                    <Input placeholder="Type Roles Required:" size="large" />
                  </Form.Item>
                </Col>
                 <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="tcode_required"
                    label="T.Code Required"
                    // rules={[{ required: true, message: 'Type T.Code Required:' }]}
                  >
                    <Input placeholder="Type T.Code Required:" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="plant"
                    label="Plant"
                    // rules={[
                    //   { required: true, message: 'Please select a Plant' },
                    // ]}
                  >
                      <SapPlantComponent
                      value={selectedPlants}
                      onChange={handlePlantChange}
                    />;
                  </Form.Item>

                </Col>
             
              
              </Row>

              <Row gutter={[12, 12]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                 <Form.Item
                    name="business_justification"
                    label="Business Justification"
                    // rules={[{ required: true, message: 'Type Business Justification' }]}
                  >
                    <Input.TextArea
                      rows={4}
                      size="large"
                      placeholder={`Enter Business Justification`}
                    />
                  </Form.Item>
                </Col>
               
                
              </Row>

            </Card>
           

             {/* Tabs for distinct sections */}
          {/* Tabs for distinct sections */}
          <Tabs defaultActiveKey="1" className="mb-10 ml-10 mr-10">
            {/* Sales and Distribution (SD) Section */}
            <TabPane tab="Sales and Distribution (SD)" key="1">
              <Card size="small">
                <Row gutter={[12, 12]}>
                  <Col lg={8} sm={24}>
                  {/*  <Form.Item
                      name={['sales_distribution',0,'sales_organization']}
                      label="Sales Organization"
                      rules={[]}
                    >
                      <Input placeholder="Enter Sales Organization" />
                    </Form.Item>*/}
                     <Form.Item
                      name={['sales_distribution',0,'sales_organization']}
                      label="Sales Organization"
                      rules={[]}
                    >
                      <ParamComponent type={'saf_sd_sales_organization'} all={true}  compId={compId}  />
                    </Form.Item>

                  </Col>
                  <Col lg={8} sm={24}>
                    <Form.Item name={['sales_distribution',0,'distribution_channel']} label="Distribution Channel"  >
                      <ParamComponent type={'saf_sd_distribution_channel'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={8} sm={24}>
                    <Form.Item name={['sales_distribution',0,'division']} label="Division"  rules={[]}>
                      <ParamComponent type={'saf_sd_division'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['sales_distribution',0,'sales_office']} label="Sales Office"  rules={[]}>
                      <ParamComponent type={'saf_sd_sales_office'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['sales_distribution',0,'sales_group']} label="Sales Group"  rules={[]}>
                      <ParamComponent type={'saf_sd_sales_group'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={['sales_distribution',0,'other_details']} label="Other Details"  rules={[]}>
                      <Input.TextArea rows={4} placeholder="Enter Other Details" />
                    </Form.Item>
                  </Col>

                </Row>
              </Card>
            </TabPane>

            {/* Material Management (MM) Section */}
            <TabPane tab="Material Management (MM)" key="2">
              <Card size="small">
                <Row gutter={[12, 12]}>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['material_management',0,'purchasing_org']} label="Purchasing Org"  rules={[]}>
                      <ParamComponent type={'saf_mm_purchasing_org'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['material_management',0,'purchasing_group']} label="Purchasing Group"  rules={[]}>
                      <ParamComponent type={'saf_mm_purchasing_group'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['material_management',0,'storage_location']} label="Storage Location"  rules={[]}>
                      <Input placeholder="Storage Location" size="large" />

                      {/*<ParamComponent type={'saf_mm_storage_location'} all={true}  compId={compId}  />*/}
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['material_management',0,'purchasing_document']} label="Purchasing Document"  rules={[]}>
                      <Input placeholder="Purchasing Document" size="large" />

                      {/*<ParamComponent type={'saf_mm_purchasing_document'} all={true}  compId={compId}  />*/}
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['material_management',0,'movement_type']} label="Movement Type"  rules={[]}>
                      <Input placeholder="Movement Type" size="large" />

                      {/*<ParamComponent type={'saf_mm_movement_type'} all={true}  compId={compId}  />*/}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={['material_management',0,'other_details']} label="Other Details"  rules={[]}>
                      <Input.TextArea rows={4} placeholder="Enter Other Details" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* Plant Maintenance (PM) Section */}
            <TabPane tab="Plant Maintenance (PM)" key="3">
              <Card size="small">
                <Row gutter={[12, 12]}>
                  <Col span={8}>
                     <Form.Item name={['plant_maintenance',0,'planning_plant']} label="Planning Plant"  rules={[]}>
                      <ParamComponent type={'saf_pm_planning_plant'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                   <Form.Item name={['plant_maintenance',0,'maintenance_plant']} label="Maintenance Plant"  rules={[]}>
                      <ParamComponent type={'saf_pm_maintenance_plant'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                   <Form.Item name={['plant_maintenance',0,'work_centers']} label="Work Centers"  rules={[]}>
                      <ParamComponent type={'saf_pm_work_center'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={['plant_maintenance',0,'other_details']} label="Other Details"  rules={[]}>
                      <Input.TextArea rows={4} placeholder="Enter Other Details" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* Financial Accounting & Costing (FICO) Section */}
            <TabPane tab="Financial Accounting & Costing (FICO)" key="4">
              <Card size="small">
                <Row gutter={[12, 12]}>
                  <Col span={12}>
                     <Form.Item name={['financial_accounting_costing',0,'profile_center']} label="Profile Center"  rules={[]}>
                      <ParamComponent type={'saf_fico_profit_center'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item name={['financial_accounting_costing',0,'cost_center']} label="Cost Center"  rules={[]}>
                      <ParamComponent type={'saf_fico_cost_center'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={['financial_accounting_costing',0,'other_details']} label="Other Details"  rules={[]}>
                      <Input.TextArea rows={4} placeholder="Enter Other Details" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* Production Planning (PP) Section */}
            <TabPane tab="Production Planning (PP)" key="5">
              <Card size="small">
                <Form.Item name={['production_planning',0,'other_details']} label="Other Details"  rules={[]}>
                  <Input.TextArea rows={4} placeholder="Enter Other Details" />
                </Form.Item>
              </Card>
            </TabPane>

            {/* Human Resource (HR) Section */}
            <TabPane tab="Human Resource (HR)" key="6">
              <Card size="small">
                <Row gutter={[12, 12]}>
                  <Col lg={8} sm={24}>
                    <Form.Item  
                      name={['human_resource',0,'personnel_area']}
                      label="Personnel Area"
                      rules={[]}
                    >
                      <ParamComponent type={'saf_hr_personnel_area'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={8} sm={24}>
                    <Form.Item name={['human_resource',0,'sub_area']} label="Sub Area"  rules={[]}>
                      <ParamComponent type={'saf_hr_sub_area'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={8} sm={24}>
                    <Form.Item name={['human_resource',0,'cost_center']} label="Cost Center"  rules={[]}>
                      <ParamComponent type={'saf_hr_cost_center'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['human_resource',0,'employee_group']} label="Employee Group"  rules={[]}>
                      <ParamComponent type={'saf_hr_employee_group'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col lg={12} sm={24}>
                    <Form.Item name={['human_resource',0,'employee_sub_group']} label="Employee Sub Group"  rules={[]}>
                      <ParamComponent type={'saf_hr_employee_sup_group'} all={true}  compId={compId}  />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={['human_resource',0,'other_details']} label="Other Details"  rules={[]}>
                    <Input.TextArea rows={4} placeholder="Enter Other Details" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>

          </Tabs>

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

export default PostEquipmentRequest;

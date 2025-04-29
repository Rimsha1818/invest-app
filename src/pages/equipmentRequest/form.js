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
  AutoComplete,
} from 'antd';
import {
  MinusCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
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
import LocationComponent from '../../components/location';
import CostCenterComponent from '../../components/costCenter';
import DepartmentComponent from '../../components/department';

import UserComponent from '../../components/user';

import crfSetting from '../../services/crfSetting';

const PostEquipmentRequest = () => {
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
  const defaultDeparmentId2 = currentUser ? currentUser.department.id : '';

  const [editInvMode, setEditInvMode] = useState(false);

  const [dataa, setDataa] = useState([]);
  const [conditionAmountRestrict, setConditionAmountRestrict] = useState(false);
  const [crfSettingData, setCrfSettingData] = useState([]);

  const [currency, setCurrency] = useState(null);
  const [currencySep, setCurrencySep] = useState(null);

  // CALCULATING THE EXPENSE RATE
  const calculatedExpRate = (event, indexx, assetIndexx, request_type) => {
    const eventValue = typeof event === 'object' && event !== null ? event.target.value : event;
    
    console.log(typeof event);

    // const rawAmt = form.getFieldValue([request_type, indexx, 'amount']);
    // const amt = Number(rawAmt.replace(/,/g, ''));
    const amt = Number(form.getFieldValue([request_type,indexx,'amount']));
    const rate = Number(form.getFieldValue([request_type,indexx,'rate']));

    console.log('amt--->',amt);

    const res = (amt*rate*Number(eventValue)).toFixed(2);
    const res2 = (amt*Number(eventValue)).toFixed(2);

    console.log(res)
    console.log(res2)
    
    const currentValues = form.getFieldsValue();

    let updatedValues = currentValues;
    if(request_type === "equipment_requests"){
      
      updatedValues = {
        ...currentValues,  
        equipment_requests: currentValues.equipment_requests.map((request, requestIndex) => {
          if (requestIndex === indexx) {  
            return {
              ...request,  
              asset_details: request.asset_details.map((detail, detailIndex) => {
                if (detailIndex === assetIndexx) {  
                  return {
                    ...detail,  
                    expected_expense: res,  
                    expected_expense_usd: res2,  
                  };
                }
                return detail;  
              }),
            };
          }
          return request;  
        }),
      };
    }
    if(request_type === "software_requests"){
      
      updatedValues = {
        ...currentValues,  
        software_requests: currentValues.software_requests.map((request, requestIndex) => {
          if (requestIndex === indexx) {  
            return {
              ...request,  
              asset_details: request.asset_details.map((detail, detailIndex) => {
                if (detailIndex === assetIndexx) {  
                  return {
                    ...detail,  
                    expected_expense: res,  
                    expected_expense_usd: res2,  
                  };
                }
                return detail;  
              }),
            };
          }
          return request;  
        }),
      };
    }
    if(request_type === "service_requests"){
      
      updatedValues = {
        ...currentValues,  
        service_requests: currentValues.service_requests.map((request, requestIndex) => {
          if (requestIndex === indexx) {  
            return {
              ...request,  
              asset_details: request.asset_details.map((detail, detailIndex) => {
                if (detailIndex === assetIndexx) {  
                  return {
                    ...detail,  
                    expected_expense: res,  
                    expected_expense_usd: res2,  
                  };
                }
                return detail;  
              }),
            };
          }
          return request;  
        }),
      };
    }

    form.setFieldsValue(updatedValues);

  };
  // CALCULATING THE EXPENSE RATE
  

 
  const getCrfSettings = async () => {
    setLoading(true);
    try {
      const response = await crfSetting.getCrfSettings();
      console.log('getCrfSettings')
      console.log(response)
      console.log('getCrfSettings')
      const crfSettingsData = response.data[0];
      setCrfSettingData(crfSettingsData);
      setLoading(false);
      
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: 'error',
      });
    }
  };

  useEffect(() => {
    getCrfSettings();
  }, []);


  const { id } = useParams();
  const navigate = useNavigate();

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
          const response = await equipmentRequestService.getEquipmentsRequestById(id);
          

          console.log('response')
          console.log(response)
          console.log('response')

          setDataa(response);

          const userArray = [];
          if (response?.approvers) {
            response.approvers.forEach((approver) => {
              if (approver?.users) {
                userArray.push(...approver.users); 
              }
            });
          }
          const editableContition = true;  
          const currentId = currentUser.user_id;  
          const formInitUser = response?.created_by?.id;  
          const editRights = userArray.find(editRights => editRights.id === currentId  && editRights.editable === true && editRights.status == 'Processing');

          if(formInitUser != currentId){ 
            if (response && response.status === 'Pending' && editRights != null && editRights !== false) {
              setEditInvMode(true)
            }
          }
          
          if (
            (response && response.draft_at !== null) ||
            (response && response.status === 'Return') ||
            (response && response.status !== 'Approved') ||
            (response && response.status !== 'Disapproved')
          ) {

            //setEditMode(true);
            setEditingEquipmentRequest(response);
            setLoading(false);
            // console.log('yeh response ', response);


            form.setFieldsValue({
              request_title: response.request_title,
              location_id: response.location.id,
              department_id: response.department.id,
              for_employee: response.for_employee,
              for_department: response.for_department?.id,
              cost_center_id: response.cost_center_id.id,
            });


            if (response && response.equipmentRequests && response.equipmentRequests.length !== 0) {
              form.setFieldsValue({
                equipment_requests: response.equipmentRequests.map(
                  (equipmentRequest) => ({
                    equipment_id: equipmentRequest.equipment.id,
                    quantity: equipmentRequest.qty,
                    state: equipmentRequest.state.id,
                    expense_type: equipmentRequest.expense_type.id,
                    expense_nature: equipmentRequest.expense_nature.id,
                    business_justification: equipmentRequest.business_justification,
                    currency: equipmentRequest.currency,
                    amount: equipmentRequest.amount,
                    rate: equipmentRequest.rate,
                    asset_details: equipmentRequest.asset_details && JSON.parse(equipmentRequest.asset_details).map((assetDetail) => ({
                      action: assetDetail.action,
                      request_type: assetDetail.request_type,
                      inventory_status: assetDetail.inventory_status,
                      qty_inventory: assetDetail.qty_inventory,
                      expected_expense: assetDetail.expected_expense,
                      expected_expense_usd: assetDetail.expected_expense_usd,
                      serial_no: assetDetail.serial_no,
                      asset_code: assetDetail.asset_code,
                      description: assetDetail.description,
                      remarks: assetDetail.remarks,
                    })),
                  })
                ),
              });
            }
            
            if (
              response &&
              response.softwareRequests &&
              response.softwareRequests.length !== 0
            ) {
              form.setFieldsValue({
                software_requests: response.softwareRequests.map(
                  (softwareRequest) => ({
                    software_name: softwareRequest.name,
                    version: softwareRequest.version,
                    quantity: softwareRequest.qty,
                    expense_type: softwareRequest.expense_type.id,
                    expense_nature: softwareRequest.expense_nature.id,
                    business_justification: softwareRequest.business_justification,
                    currency: softwareRequest.currency,
                    amount: softwareRequest.amount,
                    rate: softwareRequest.rate,
                    asset_details: softwareRequest.asset_details && JSON.parse(softwareRequest.asset_details).map((assetDetail) => ({
                      action: assetDetail.action,
                      request_type: assetDetail.request_type,
                      inventory_status: assetDetail.inventory_status,
                      qty_inventory: assetDetail.qty_inventory,
                      expected_expense: assetDetail.expected_expense,
                      expected_expense_usd: assetDetail.expected_expense_usd,
                      serial_no: assetDetail.serial_no,
                      asset_code: assetDetail.asset_code,
                      description: assetDetail.description,
                      remarks: assetDetail.remarks,
                    })),
                  })
                ),
              });
            }
            if (
              response &&
              response.serviceRequests &&
              response.serviceRequests.length !== 0
            ) {
              form.setFieldsValue({
                service_requests: response.serviceRequests.map(
                  (serviceRequest) => ({
                    service_name: serviceRequest.name,
                    state: serviceRequest.state.id,
                    expense_type: serviceRequest.expense_type.id,
                    expense_nature: serviceRequest.expense_nature.id,
                    business_justification: serviceRequest.business_justification,
                    currency: serviceRequest.currency,
                    amount: serviceRequest.amount,
                    rate: serviceRequest.rate,
                    asset_details: serviceRequest.asset_details && JSON.parse(serviceRequest.asset_details).map((assetDetail) => ({
                      action: assetDetail.action,
                      request_type: assetDetail.request_type,
                      inventory_status: assetDetail.inventory_status,
                      qty_inventory: assetDetail.qty_inventory,
                      expected_expense: assetDetail.expected_expense,
                      serial_no: assetDetail.serial_no,
                      asset_code: assetDetail.asset_code,
                      description: assetDetail.description,
                      remarks: assetDetail.remarks,
                    })),
                  })
                ),
              });
            }
          } else {
            navigate('/crf');
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          navigate('/crf');
        }
        else {
          console.log(error);
        notification.error({
          message: 'Error fetching Capital Request Form',
          description: error,
        });
        }
        
      }
    };
    fetchData();
  }, [id, form]);

  const convertAssetDetailsToString = (assetDetailsArray) => {
    return JSON.stringify(assetDetailsArray.map(assetDetail => ({
      request_type: assetDetail.request_type,
      action: assetDetail.action,
      inventory_status: assetDetail.inventory_status,
      qty_inventory: assetDetail.qty_inventory,
      expected_expense: assetDetail.expected_expense,
      expected_expense_usd: assetDetail.expected_expense_usd,
      serial_no: assetDetail.serial_no,
      asset_code: assetDetail.asset_code,
      description: assetDetail.description,
      remarks: assetDetail.remarks,
    })));
  };
  const onFinish = async (values) => {
    setLoading(true);

    const { for_department, for_employee, equipment_requests, software_requests, service_requests } = values;

    const mergedRequests = [
      ...(equipment_requests || []),
      ...(software_requests || []),
      ...(service_requests || []),
    ];
    // --------- FOR CONDITION WORKFLOW AMOUNT RESTRICTION

    // ------------------ FOR CONDITION Match
      const userArray2 = [];
      if (dataa?.approvers) {
        dataa.approvers.forEach((approver) => {
          if (approver?.users) {
            approver.users.forEach((user) => {
              userArray2.push({ user, condition: approver.condition });
            });
          }
        });
      }
    
      const workflowAmtCondition = userArray2.find(workflowAmtCondition => 
        workflowAmtCondition.user.id === currentUser.user_id
        && workflowAmtCondition.user.status == 'Processing'
        && workflowAmtCondition.condition == 7
        );

      let conditionAmtRestTep = false;
      if (workflowAmtCondition !== undefined) {
        setConditionAmountRestrict(true);
        conditionAmtRestTep = true;
      }

    // ------------------ FOR Amount Get
      const capital_max_amount = crfSettingData.data[0].capital_max_amount;
      const revenue_max_amount = crfSettingData.data[0].revenue_max_amount;
      
    // ------------------ FOR Amount Limitation from expected expense & expense nature based
      const validateRequests = (mergedRequests) => {

      let errorss = [];

      mergedRequests.forEach((request, requestIndex) => {
        request.asset_details?.forEach((asset, assetIndex) => {
          if (
            (request.expense_nature === 1 && asset.expected_expense > capital_max_amount) ||
            (request.expense_nature === 2 && asset.expected_expense > revenue_max_amount)
          ) {
            errorss.push(
              `Error in request ${requestIndex + 1}, Inventory# ${assetIndex + 1}: Expected expense exceeds the limit (${request.expense_nature === 1 ? capital_max_amount : revenue_max_amount})  for expense_nature ${request.expense_nature === 1 ? 'capital' : 'revenue'}.`
            );
          }
        });
      });

      return errorss;
    };
    const errorss = validateRequests(mergedRequests);


    // THROW ERROR, When workflow condition matched
    if(conditionAmtRestTep === true){

      if (errorss.length > 0) {
        console.error("Validation Errorss:", errorss);
        message.error(`Validation Errorss: ${errorss}`);
        setLoading(false);
        return;
      } else {
        console.log("All requests are valid.");
      }

    }

    // Dev Console
    console.log("userArray2",userArray2);
    console.log("conditionAmtRestTep",conditionAmtRestTep);
    console.log("crfSettingData.data[0]",crfSettingData.data[0]);

    // --------- FOR CONDITION WORKFLOW AMOUNT RESTRICTION


    // const { for_department, for_employee, equipment_requests, software_requests, service_requests } = values;
    if (
      (!equipment_requests || equipment_requests.length === 0) &&
      (!software_requests || software_requests.length === 0) &&
      (!service_requests || service_requests.length === 0)
    ) {
      message.error('Please fill out at least one form (equipment, software, or service request)');
      setLoading(false);
      return;
    }

    if (typeof for_department === 'undefined') {
      values.for_department = '';  // Assign null if undefined
    }

    if (typeof for_employee === 'undefined') {
      values.for_employee = '';  // Assign null if undefined
    }


    try {
      values.save_as_draft = String(isDraft);
      //console.log(values)
      
      const equipmentRequestsArray = Array.isArray(values.equipment_requests) ? values.equipment_requests : [];
      const formattedEquipmentRequestsArray = equipmentRequestsArray.map(equipmentRequest => ({
        ...equipmentRequest,
        asset_details: convertAssetDetailsToString(equipmentRequest?.asset_details || []),
      }));

      const softwareRequestsArray = Array.isArray(values.software_requests) ? values.software_requests : [];
      const formattedSoftwareRequestsArray = softwareRequestsArray.length > 0
        ? softwareRequestsArray.map(softwareRequest => ({
          ...softwareRequest,
          asset_details: convertAssetDetailsToString(softwareRequest?.asset_details || []),
        }))
        : null;

      const serviceRequestsArray = Array.isArray(values.service_requests) ? values.service_requests : [];
      const formattedServiceRequestsArray = serviceRequestsArray.length > 0
        ? serviceRequestsArray.map(serviceRequest => ({
          ...serviceRequest,
          asset_details: convertAssetDetailsToString(serviceRequest?.asset_details || []),
        }))
        : null;


      const formattedData = {
        ...values, 
        equipment_requests: formattedEquipmentRequestsArray,
        software_requests: formattedSoftwareRequestsArray,
        service_requests: formattedServiceRequestsArray,
        save_as_draft: values.save_as_draft,
      };

      //console.log(JSON.stringify(formattedData))

      if (editMode) {
        const response = await equipmentRequestService.updateEquipmentRequest(
          editingEquipmentRequest.id,
          formattedData
        );

        if (response.success) {
          setEditMode(false);
          setEditingEquipmentRequest(null);
          notification.success({
            message: 'Equipment Updated',
            description: response.message,
            
          });
          navigate('/crf');
        }
      } else {
        const response = await equipmentRequestService.postEquipmentRequest(
          formattedData
        );

        if (response.success) {
          form.resetFields();
          notification.success({
            message: 'Equipment Added',
            description: response.message,
          });
          navigate('/crf');
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      notification.error({
        message: 'Equipment Operation Failed',
        description: error.response.data.message,
      });
    }
  };

  const getAllEquipmentData = async () => {
    try {
      const response = await equipmentService.getAllEquipments();
      setEquipmentData(response);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response,
      });
    }
  };

  useEffect(() => {
    getAllEquipmentData();
  }, []);

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


  let initiatorUser = false;
  initiatorUser = 
    editingEquipmentRequest?.created_by?.id != null && 
    currentUser?.user_id != null && 
    editingEquipmentRequest.created_by.id === currentUser.user_id;


  const csValue = editingEquipmentRequest?.cost_center_id?.id != null 
      ? editingEquipmentRequest.cost_center_id.id 
      : 0;


  const [options, setOptions] = useState([]);

  const handleSearch = async (searchText) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    try {
      const data = await equipmentRequestService.getEmployeeByTitle(searchText);
      const dataArray = Object.values(data);

      const newOptions = dataArray[1].map((item) => ({
        value: item.employee,
        label: item.employee,
      }));
      setOptions(newOptions);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };


  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<FileTextOutlined />} title="Capital Request Form" />
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
           

            <Card size="small" className="mb-10" title="Request Title">
              <Row gutter={[12, 12]}>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="request_title"
                    label="Request Title"
                    rules={[{ required: true, message: 'Type Request Title' }]}
                  >
                    <Input placeholder="Type Request Title" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="department_id"
                  label="Department"
                  initialValue={defaultDeparmentId}
                  rules={[
                    { required: true, message: 'Please select a Department' },
                  ]}>
                
                    <DepartmentComponent all={true} />
                </Form.Item>

              </Col>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Form.Item
                  label="Employee name / Employer code"
                  name="for_employee"
                  rules={[
                    // {
                    //   required: true,
                    //   message: "Please enter the Employee",
                    // },
                  ]}
                >
                  <AutoComplete
                    options={options} // Pass the dynamic options
                    onSearch={handleSearch} // Trigger handleSearch on input change
                    placeholder="Type to search"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="for_department"
                  label="For Department"
                  initialValue={defaultDeparmentId2}
                  rules={[
                    // { required: true, message: 'Please select a Department' },
                  ]}>
                
                    <DepartmentComponent all={true} />
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
                <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="cost_center_id"
                  label="Cost Center"
                  rules={[
                    { required: true, message: 'Please select a cost center' },
                  ]}
                  // initialValue={defaultLocationId}

                >

                    {/*<CostCenterComponent related={true} />
                    <CostCenterComponent all={true} value={} fixed={} />*/}

                    {!editMode ? (
                        <CostCenterComponent related={true} />
                    ) : initiatorUser ? (
                        <CostCenterComponent related={true} />
                    ) : (
                        <CostCenterComponent all={true} value={csValue} fixed={true} />
                    )}
                </Form.Item>

              </Col>
              </Row>
            </Card>

            <Form.List name="equipment_requests">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(
                    ({ key, name, fieldKey, ...restField }, index) => {
                      const isEditMode = editMode && editingEquipmentRequest;

                      return (
                        <>
                          <Card
                            key={key}
                            size="small"
                            className="mb-10"
                            title={`Equipment Request Form ${index + 1}`}
                            extra={
                              <Button
                                type="danger"
                                icon={<MinusCircleOutlined />}
                                onClick={() => {
                                  remove(name);
                                  setSelectedCheckboxes((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            }
                          >
                            <Row gutter={[12, 12]}>
                              <Col
                                lg={12}
                                md={12}
                                sm={24}
                                xs={24}
                                className="mb-10"
                              >
                                <Form.Item
  label="Requirement"
  name={[name, 'equipment_id']}
  rules={[
    {
      required: true,
      message: 'Please select a requirement!',
    },
  ]}
>
  <Select
    size="large"
    onChange={(value) => handleRequirementChange(index, value)}
  >
    {equipmentData.map((equipment) => (
      <Select.Option key={equipment.name} value={equipment.id}>
        {equipment.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

                              </Col>
                            </Row>
                            <Row gutter={[12, 12]}>
                              <Col lg={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                  name={[name, `quantity`]}
                                  label={`Quantity`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Enter Quantity',
                                    },
                                  ]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                              <Col lg={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                  name={[name, `state`]}
                                  label={`Equipment State`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please select Equipment State',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch={true}
                                    optionFilterProp="children"
                                    size="large"
                                    placeholder={`Select Equipment Type`}
                                  >
                                    <Select.Option value={1}>New</Select.Option>
                                    {/* <Select.Option value={2}>Renew</Select.Option> */}
                                    <Select.Option value={3}>
                                      Repair
                                    </Select.Option>
                                    <Select.Option value={4}>
                                      Replace
                                    </Select.Option>
                                    <Select.Option value={5}>
                                      Temporary
                                    </Select.Option>
                                    <Select.Option value={6}>
                                      Upgrade
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col lg={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                  name={[name, `expense_type`]}
                                  label={`Expenses Type`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please select Expenses Type',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch={true}
                                    optionFilterProp="children"
                                    size="large"
                                    placeholder={`Select Expenses Type`}
                                  >
                                    <Select.Option value={1}>
                                      Budgeted
                                    </Select.Option>
                                    <Select.Option value={2}>
                                      Non Budgeted
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col lg={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                  name={[name, `expense_nature`]}
                                  label={`Expense Nature`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please select Expense Nature',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch={true}
                                    optionFilterProp="children"
                                    size="large"
                                    placeholder={`Select Expense Nature`}
                                  >
                                    <Select.Option value={1}>
                                      Capital
                                    </Select.Option>
                                    <Select.Option value={2}>
                                      Revenue
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={[12, 12]}>
                              <Col
                                lg={24}
                                md={24}
                                sm={24}
                                xs={24}
                                className="mb-10"
                              >
                                <Form.Item
                                  label={`Business Justification`}
                                  name={[name, `business_justification`]}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Enter Business Justification',
                                    },
                                  ]}
                                >
                                  <Input.TextArea
                                    rows={4}
                                    size="large"
                                    placeholder={`Enter Business Justification`}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            
            {editInvMode && <EquipmentCalculatComponent name={name} index={index} request_type="equipment_requests" calculatedExpRate={calculatedExpRate}  form={form}  setCurrency={setCurrencySep} />}
            {editInvMode && <InventoryAssetComponent index={index} request_type="equipment_requests" calculatedExpRate={calculatedExpRate}  form={form} currency={currency} crfSetting={crfSettingData} />}

                          </Card>
                        </>
                      );
                    }
                  )}
                  <Form.Item style={{ margin: '10px' }}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                        setSelectedCheckboxes((prev) => [...prev, []]);
                      }}
                      icon={<PlusOutlined />}
                    >
                      Add Equipment Request Form
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.List name="software_requests">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(
                    ({ key, name, fieldKey, ...restField }, index) => (
                      <Card
                        key={key}
                        size="small"
                        className="mb-10"
                        title={`Software Request Form ${index + 1}`}
                        extra={
                          <Button
                            type="danger"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          >
                            Remove
                          </Button>
                        }
                      >
                        <Row gutter={[12, 12]}>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `software_name`]}
                              label="Software Name"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter Software Name',
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                placeholder="Enter Software Name"
                              />
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `version`]}
                              label="Software Version"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter Software Version',
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                placeholder="Enter Software Version"
                              />
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `quantity`]}
                              label="Software Quantity"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter Software Quantity',
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                placeholder="Enter Software Quantity"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={[12, 12]}>
                          <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `expense_type`]}
                              label="Expenses Type"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select a Expenses Type',
                                },
                              ]}
                            >
                              <Select
                                showSearch={true}
                                optionFilterProp="children"
                                size="large"
                                placeholder="Select Expenses Type"
                              >
                                <Select.Option value={1}>
                                  Budgeted
                                </Select.Option>
                                <Select.Option value={2}>
                                  Non Budgeted
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `expense_nature`]}
                              label="Expense Nature"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select a Expense Nature',
                                },
                              ]}
                            >
                              <Select
                                showSearch={true}
                                optionFilterProp="children"
                                size="large"
                                placeholder="Select Expense Nature"
                              >
                                <Select.Option value={1}>Capital</Select.Option>
                                <Select.Option value={2}>Revenue</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={[12, 12]}>
                          <Col
                            lg={24}
                            md={24}
                            sm={24}
                            xs={24}
                            className="mb-10"
                          >
                            <Form.Item
                              name={[name, `business_justification`]}
                              label="Business Justification"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    'Please enter Business Justification',
                                },
                              ]}
                            >
                              <Input.TextArea
                                rows={4}
                                size="large"
                                placeholder="Enter Business Justification"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

          {editInvMode && <EquipmentCalculatComponent name={name} index={index} request_type="software_requests" calculatedExpRate={calculatedExpRate}  form={form}  setCurrency={setCurrencySep}/>}
          {/*{editMode && <InventoryAssetComponent index={index} request_type="software_requests" /> }*/}
          {editInvMode && <InventoryAssetComponent index={index} request_type="software_requests" calculatedExpRate={calculatedExpRate}  form={form} currency={currency} crfSetting={crfSettingData} />}

                      </Card>
                    )
                  )}

                  <Form.Item style={{ margin: '10px' }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Software Request Form
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.List name="service_requests">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(
                    ({ key, name, fieldKey, ...restField }, index) => (
                      <Card
                        key={key}
                        size="small"
                        className="mb-10"
                        title={`Service Request Form ${index + 1}`}
                        extra={
                          <Button
                            type="danger"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          >
                            Remove
                          </Button>
                        }
                      >
                        <Row gutter={[12, 12]}>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `service_name`]}
                              label="Required Service (Nature)"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    'Please enter Required Service (Nature)',
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                placeholder="Enter Required Service (Nature)"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={[12, 12]}>
                          <Col lg={8} md={8} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `state`]}
                              label="Service State"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select a Service State',
                                },
                              ]}
                            >
                              <Select
                                showSearch={true}
                                optionFilterProp="children"
                                size="large"
                                placeholder="Select Service Type"
                              >
                                <Select.Option value={1}>New</Select.Option>
                                <Select.Option value={2}>Renewal</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col lg={8} md={8} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `expense_type`]}
                              label="Expenses Type"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select a Expenses Type',
                                },
                              ]}
                            >
                              <Select
                                showSearch={true}
                                optionFilterProp="children"
                                size="large"
                                placeholder="Select Expenses Type"
                              >
                                <Select.Option value={1}>
                                  Budgeted
                                </Select.Option>
                                <Select.Option value={2}>
                                  Non Budgeted
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col lg={8} md={8} sm={24} xs={24}>
                            <Form.Item
                              name={[name, `expense_nature`]}
                              label="Expense Nature"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select a Expense Nature',
                                },
                              ]}
                            >
                              <Select
                                showSearch={true}
                                optionFilterProp="children"
                                size="large"
                                placeholder="Select Expense Nature"
                              >
                                <Select.Option value={1}>Capital</Select.Option>
                                <Select.Option value={2}>Revenue</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={[12, 12]}>
                          <Col
                            lg={24}
                            md={24}
                            sm={24}
                            xs={24}
                            className="mb-10"
                          >
                            <Form.Item
                              name={[name, `business_justification`]}
                              label="Business Justification"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    'Please enter Business Justification',
                                },
                              ]}
                            >
                              <Input.TextArea
                                rows={4}
                                size="large"
                                placeholder="Enter Business Justification"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

            {editInvMode && <EquipmentCalculatComponent name={name} index={index} request_type="service_requests" calculatedExpRate={calculatedExpRate}  form={form}  setCurrency={setCurrencySep} />}
            {/*{editMode && <InventoryAssetComponent index={index} request_type="service_requests" /> }*/}
            {editInvMode && <InventoryAssetComponent index={index} request_type="service_requests" calculatedExpRate={calculatedExpRate}  form={form} currency={currency} crfSetting={crfSettingData} />}
                        
                      </Card>
                    )
                  )}

                  <Form.Item style={{ margin: '10px' }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Service Request Form
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

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


                  {!editMode ? (
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
                  ) : initiatorUser ? (
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
                  ) : ""}
                  

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

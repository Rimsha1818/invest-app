import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import deploymentService from "../../services/deployment";
import { useSelector } from "react-redux";
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
  AutoComplete,
  DatePicker,
  TimePicker,
} from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import categoryService from "../../services/category";
import DefaultLayout from "../../components/layout/DefaultLayout";
import LocationComponent from "../../components/location";
import FormListComponent from "./../../components/formList/index";

import qaService from "../../services/qualityAssurance";
import csrfService from "../../services/scrf";
import equipmentRequestService from "../../services/equipmentRequest";
import mobileRequisitionService from "../../services/mobileRequisition";
import mdmService from "../../services/mdm";

import ProjectComponent from "../../components/project";


const { Option } = Select;

export default function MdmForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [referenceDoumentTitle, setReferenceDoumentTitle] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lloading, setLloading] = useState(true);
  const [mdmLoading, setMdmLoading] = useState(false);
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

  // FOR ONCHANGE DOCUMENT
  const [selectedId, setSelectedId] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          getDeploymentDetails(id);
        } else {
          // Fetch initial categories and default subcategories
          await getCategories();
          const defaultCategoryId = defaultLocationId; // Assuming defaultLocationId holds a category
          if (defaultCategoryId) {
            await onCategoryChange(defaultCategoryId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchData();
  }, [id, defaultLocationId]);

  useEffect(() => {
    triggerAuto();
  }, [selectedId]);

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
    // console.log('message, description');
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

    navigate("/dashboard");
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
    // console.log(value)
    try {
      const response = await categoryService.getAllSubCategories(value);
      // console.log(response)
      setSubCategories(response.data.software_subcategories);
    } catch (error) {
      console.error("Error while fetching subCategories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const referenceDocumentTitle = (rd, frmId) => {
    // console.log('eeeeeeeehhhhhhhhhhhhhhhh',rd);
    // console.log(frmId);

    switch (frmId) {
      case 1:
        getQaDetails(rd);
        break;
      case 2:
        getScrfDetails(rd);
        break;
      // case 3:
      //   getDeploymentDetails(rd);
      //   break;
      case 4:
        getEquipmentsRequestById(rd);
        break;
      case 5:
        getMRDetails(rd);
        break;
      case 6:
        getMdmDetails(rd);
        break;
      default:
        return "-";
    }
  };

  const getQaDetails = async (rd) => {
    // console.log('ooooooooooooooooooohhhhhhhhhhhh1');
    await qaService
      .getQaDetails(rd)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching qa records");
      });
  };
  const getScrfDetails = async (rd) => {
    // console.log('ooooooooooooooooooohhhhhhhhhhhh2');
    await csrfService
      .getScrfDetails(rd)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching scrf records");
      });
  };
  const getEquipmentsRequestById = async (rd) => {
    // console.log('ooooooooooooooooooohhhhhhhhhhhh3');
    await equipmentRequestService
      .getEquipmentsRequestById(rd)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching crf records");
      });
  };
  const getMRDetails = async (rd) => {
    // console.log('ooooooooooooooooooohhhhhhhhhhhh4');
    await mobileRequisitionService
      .getMRDetails(rd)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching mdm records");
      });
  };
  const getMdmDetails = async (rd) => {
    // console.log('ooooooooooooooooooohhhhhhhhhhhh5');
    await mdmService
      .getMdmDetails(rd)
      .then((response) => {
        setReferenceDoumentTitle(response.request_title);
      })
      .catch((error) => {
        console.log("error fetching mdm records");
      });
  };
  const getDeploymentDetails = async (id) => {
    setMdmLoading(true);
    try {
      const record = await deploymentService.getDeploymentDetails(id);
      console.log("result hai ", record);
      setEdit(record);

      let fn = "";
      if (record.reference_form_id == "1") {
        fn = "Quality Assurance";
      }
      if (record.reference_form_id == "2") {
        fn = "SCRF";
      }
      if (record.reference_form_id == "3") {
        fn = "Deployment";
      }
      if (record.reference_form_id == "4") {
        fn = "CRF";
      }
      if (record.reference_form_id == "5") {
        fn = "Mobile Requisition Form";
      }
      if (record.reference_form_id == "6") {
        fn = "Master Data Management";
      }
      if (record.reference_form_id == "7") {
        fn = "Sap Access Form";
      }
      
      setFileList(
        record.attachments.map((attachment) => ({
          key: attachment.id,
          uid: attachment.id,
          name: attachment.original_title,
          status: 'done',
          url: attachment.filename,
        }))
      );

      handleFormTypeChange(record.reference_form_id.id);

      const label = await referenceDocumentTitle(
        record.reference_details,
        record.reference_form_id.id
      );
      const adsa = {
        value: record.reference_details, // Backend ID
        label, // Displayed label
      };
      triggerAuto("a");

      setSelectedReferenceDetail(record.reference_details.id);
      setDisplayedReferenceDetail(adsa.label);

      form.setFieldsValue({
        request_title: record.request_title,
        location_id: record.location.id,
        change_priority: record.change_priority,
        reference_form_id: record.reference_form_id.id,
        project_id: record.project_id?.id,
        reference_details: record.reference_details?.id,

        document_details: record.deploymentDetail.map((scenario, index) => ({
          id: index,
          document_no: scenario.document_no,
          detail: scenario.detail,
        })),
      });
      selectedReferenceDetail(record.reference_details?.id);
      setFields(record.deploymentDetail.map((_, index) => ({ id: index })));
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setMdmLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setUploading(true);

    const { controls_improved, process_efficiency, cost_saved, legal_reasons } =
      values;
    if (isDraft == "false") {
      if (
        !controls_improved &&
        !process_efficiency &&
        !cost_saved &&
        !legal_reasons
      ) {
        message.error(
          "Please fill out at least one field Audit & Legal Requirement, Control Improvements, Business Process Change, Cost Saved"
        );
        setLoading(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      for (const key in values) {
        if (Array.isArray(values[key])) {
          values[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item || "");
          });
        } else {
          formData.append(key, values[key] || "");
        }

        if (key === "document_details") {
          values[key].forEach((documentDetail, index) => {
            formData.append(
              `document_details[${index}][document_no]`,
              documentDetail.document_no || ""
            );
            formData.append(
              `document_details[${index}][detail]`,
              documentDetail.detail || ""
            );
          });
        }
      }

      if (fileList) {
        fileList.forEach((file, index) => {
          if (!file.url) {
            // Check if the file is new
            formData.append(`attachments[${index}]`, file);
          }
        });
      }
      deletedAttachments.forEach((attachmentId, index) => {
        formData.append(`deleted_attachments[${index}]`, attachmentId);
      });
      // formData.append('deleted_attachments', JSON.stringify(deletedAttachments));
      formData.append(`save_as_draft`, isDraft);
      formData.append(`reference_details`, selectedReferenceDetail);
      formData.append(`reference_form_id`, selectedId);
      formData.append(`form_id`, 3);

      let response;
      if (edit && edit.id) {
        response = await deploymentService.updateDeployment(edit.id, formData);
      } else {
        response = await deploymentService.postDeployment(formData);
      }

      if (response.success) {
        handleSuccess("Deployment Form Added", response.message);
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    }
  };

  const handleRemoveAttachment = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((f) => f.uid !== file.uid)
    );
    console.log("file ", file);

    if (file.url) {
      setDeletedAttachments((prevDeleted) => [...prevDeleted, file.key]);
      console.log("send file.key  ", file.key);
    }
  };

  const addField = () => {
    const newField = {
      id: fields.length,
      details: "",
      status: "",
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

  const [options, setOptions] = useState([]);
  const [selectedReferenceDetail, setSelectedReferenceDetail] = useState(null);
  const [displayedReferenceDetail, setDisplayedReferenceDetail] = useState("");

  useEffect(() => {
    if (referenceDocumentTitle && options && selectedReferenceDetail) {
      const valueToFind = selectedReferenceDetail;
      const foundOption = options.find((option) => option.value == valueToFind);
      const label = foundOption ? foundOption.label : "";

      if (!label) {
        setLloading(true);

        // Updated for empty search trigger
        if (!options) {
          triggerAuto("a");
        }
      } else {
        setLloading(false);
      }

      form.setFieldsValue({
        reference_details: label,
        // reference_details: selectedReferenceDetail,
      });

      setDisplayedReferenceDetail(referenceDocumentTitle);
    }
  }, [options, referenceDoumentTitle, selectedReferenceDetail]);

  const triggerAuto = (value = 1) => {
    handleSearch("a", value);
  };

  const handleSearch = async (searchText) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    try {
      const data = await deploymentService.getDepByTitle_Form(
        searchText,
        selectedId
      );

      console.log("ujujuj");
      console.log(data);
      console.log("ujujuj");

      // const dataArray = Object.values(data);
      const dataArray = data ? Object.values(data) : [];

      // if (dataArray.length === 0) {
      //   setOptions(
      //   [{
      //     value: 0,
      //     label: `Record Not Found`,
      //   }]
      //   );
      // return;
      // }

      const newOptions = dataArray[1]?.length
        ? dataArray[1].map((item) => ({
            value: item.id,
            label: `${item.sequence_no} (${item.request_title})`,
          }))
        : [{ value: "default", label: "No Data Available" }];

      // const newOptions = dataArray[1].map((item) => ({
      //   value: item.id,
      //   label: `${item.sequence_no} (${item.request_title})`,
      // }));

      setOptions(newOptions);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  const handleReferenceDetailChange = (value, option) => {
    setSelectedReferenceDetail(value); // Store ID for backend
    setDisplayedReferenceDetail(option.label); // Display label
  };
  const handleFormTypeChange = async (value) => {
    console.log(value);
    setSelectedId(value);
    triggerAuto(value);
  };

  return (
    <DefaultLayout>
      <Spin spinning={mdmLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="mb-50"
        >
          <Card title="Basic Details">
            <Row gutter={[24, 24]}>
              <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  label="Deployment Title"
                  name="request_title"
                  // rules={[
                  //   { required: true, message: 'Please provide justification' },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={12}>
                <Form.Item
                  label="Priority"
                  name="change_priority"
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    size="large"
                    placeholder="Please select"
                  >
                    <Option value="Normal">Normal</Option>
                    <Option value="Urgent">Urgent</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={12}>
                <Form.Item
                  name="location_id"
                  label="Location"
                  rules={[
                    { required: true, message: "Please select a location" },
                  ]}
                  initialValue={defaultLocationId}
                >
                  <LocationComponent all={true} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Reference Document Details">
            <Row gutter={24}>
              <>
                <Col lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    label="Reference Form"
                    name="reference_form_id"

                  >
                    <FormListComponent onChange={handleFormTypeChange} />
                  </Form.Item>
                </Col>

                {selectedId !== null && (
                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      label="Reference Detail"
                      name="reference_details"
                      rules={[
                        {
                          required: true,
                          message: "Please select a reference detail",
                        },
                      ]}

                    >
                      <Select
                        showSearch
                        placeholder="Type to search"
                        size="large"
                        options={options} // Dynamic options
                        onSearch={handleSearch} // Trigger search dynamically
                        onChange={handleReferenceDetailChange} // Handle selection
                        value={selectedReferenceDetail} // Bind the selected value (ID)
                        optionLabelProp="label" // Use the label for display
                        filterOption={false} // Disable default filtering to enable server-side search
                        notFoundContent={
                          lloading ? <Spin size="small" /> : "No data"
                        }
                      />
                    </Form.Item>
                  </Col>
                )}
              </>
                {selectedId !== null && (

              <Col lg={8} md={8} sm={12} xs={12}>
                <Form.Item
                  label="Project"
                  name="project_id"
                >
                  <ProjectComponent all={true} form_id={selectedId} />
                  {/*<LocationComponent all={true} />*/}

                </Form.Item>
              </Col>
                )}
            </Row>

            <Row gutter={[16, 15]}>
              <Col span={24} className="mb-40">
                <Upload.Dragger
                  multiple
                  {...props}
                  onRemove={(file) => handleRemoveAttachment(file)}
                >
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

          <Row gutter={[12, 12]}>
            <Col span={24}>
              {fields.map((field, index) => (
                <Card
                  key={field.id}
                  title={
                    <span>
                      <Badge
                        style={{ marginTop: "-3px" }}
                        color="#2d77fa"
                        count={index + 1}
                      />{" "}
                      Detail
                    </span>
                  }
                  className="mb-7"
                >
                  <Row
                    gutter={[12, 12]}
                    key={field.id}
                    style={{ display: "flex", marginBottom: 34 }}
                  >
                    <Col span={12}>
                      <Form.Item
                        name={["document_details", field.id, "document_no"]}
                        label="Deployment Technical Number"
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
                    <Col span={12}>
                      <Form.Item
                        label="Deployment Technical Description"
                        name={["document_details", field.id, "detail"]}
                        // rules={[
                        //   { required: true, message: 'Please provide justification' },
                        // ]}
                      >
                        <Input.TextArea rows={10} />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      {field.id === 0 ? null : (
                        <Button
                          style={{ marginTop: "27px" }}
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
              <Form.Item className="textRight" style={{ marginRight: "10px" }}>
                <Button
                  type="dashed"
                  onClick={addField}
                  icon={<PlusOutlined />}
                >
                  Add Deployment Details
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="mt-24 formbtnarea"
          >
            <Button
              type="primary"
              block
              disabled={loading}
              loading={loading}
              className="mr-20"
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

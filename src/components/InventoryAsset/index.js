import React, { useState } from 'react';
import { Form, Input, Select, Row, Col, Card, Button, InputNumber} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select;

function InventoryAssetComponent({ index, request_type, calculatedExpRate, form , currency, crfSetting }) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  return (
    <Form.List name={[index, 'asset_details']}>
      {(assetFields, { add: addAsset, remove: removeAsset }) => (
        <>
          {assetFields.map(
            (
              { key: assetKey, name: assetName, fieldKey, ...assetRestField },
              assetIndex
            ) => (
              <Card
                key={assetKey}
                size="small"
                className="mb-10"
                title={`to be filled by concerned department ${assetIndex + 1}`}
                extra={
                  <Button
                    type="danger"
                    icon={<MinusCircleOutlined />}
                    onClick={() => {
                      removeAsset(assetIndex);
                      setSelectedCheckboxes((prev) =>
                        prev.filter((_, i) => i !== assetIndex)
                      );
                    }}
                  >
                    Remove
                  </Button>
                }
              >
                <Row gutter={[12, 12]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      {...assetRestField}
                      label="Action"
                      name={[assetIndex, 'action']}
                      fieldKey={[fieldKey, 'action']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select an action',
                        },
                      ]}
                    >
                      <Select
                        showSearch={true}
                        optionFilterProp="children"
                        size="large"
                        placeholder="Select Action"
                      >
                        <Option value="Issued from Inventory">
                          Issued from Inventory
                        </Option>
                        <Option value="Internal Transfer">
                          Internal Transfer
                        </Option>
                        <Option value="Purchase">Purchase</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[12, 12]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      {...assetRestField}
                      label="Hidden Field"
                      name={[assetIndex, 'request_type']}
                      fieldKey={[fieldKey, 'request_type']}
                      style={{ display: 'none' }}
                      initialValue={request_type}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[12, 12]}>
                

                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      label="Inventory Status"
                      name={[assetIndex, 'inventory_status']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter Inventory Status',
                      //   },
                      // ]}
                    >
                      <Input
                        size="large"
                        placeholder="Enter Inventory Status"
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      label="Qty"
                      name={[assetIndex, 'qty_inventory']}
                      onChange={(e) => {
                        // const actionField = form.getFieldValue(['equipment_requests',index,'asset_details',assetIndex,'action']);
                        // const actionField = form.getFieldValue([request_type,index,'asset_details',assetIndex,'action']);
                          calculatedExpRate(e, index, assetIndex, request_type);  
                        // if(actionField == "Purchase"){
                        // }
                      }}
                      rules={[
                        {
                          required: true,
                          message: 'Enter Qty',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter Qty" />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      // label=`Expected Expenses ( ${crfSettingData?.data?.[0]?.crf_currency || 'PKR'} )`
                      label={`Expected Expenses (${crfSetting?.data?.[0]?.crf_currency || 'PKR'})`}
                      name={[assetIndex, 'expected_expense']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter Expected Expenses',
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        placeholder="Enter Expected Expenses"
                        min={0} style={{width:'100%'}}
                        formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/,/g, '')}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[12, 12]}>
                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      label="Serial#"
                      name={[assetIndex, 'serial_no']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter Serial#',
                      //   },
                      // ]}
                    >
                      <Input size="large" placeholder="Enter Serial#" />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      label="Asset Code"
                      name={[assetIndex, 'asset_code']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter Asset Code',
                      //   },
                      // ]}
                    >
                      <Input size="large" placeholder="Enter Asset Code" />
                    </Form.Item>
                  </Col>
                  
                  <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      // label={`Expected Expenses (${currency || form.getFieldValue([request_type, index,'currency'])})`}
                      label={`Expected Expenses (${form.getFieldValue([request_type, index,'currency'])})`}
                      name={[assetIndex, 'expected_expense_usd']}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        placeholder=""
                        min={0} style={{width:'100%'}}
                        formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/,/g, '')}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[12, 12]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                    label="Remarks/Description"
                    name={[assetIndex, 'description']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter Description',
                      //   },
                      // ]}
                    >
                      <Input.TextArea
                        rows={4}
                        size="large"
                        placeholder="Enter Description"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/*<Row gutter={[12, 12]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      {...assetRestField}
                      label="Remarks"
                      name={[assetIndex, 'remarks']}
                      fieldKey={[fieldKey, 'remarks']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter Remarks',
                      //   },
                      // ]}
                      // hidden 
                    >
                      <Input size="large" placeholder="Enter Remarks" />
                    </Form.Item>
                  </Col>
                </Row>*/}
              </Card>
            )
          )}

          <Form.Item style={{ margin: '10px' }}>
            <Button
              type="dashed"
              onClick={() => {
                addAsset();
              }}
              icon={<PlusOutlined />}
            >
              Add Inventory Form
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
    
  );
}

export default InventoryAssetComponent;

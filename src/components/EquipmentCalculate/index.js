import React, {useState} from 'react';
import { Row, Col, Form, Select, Input, InputNumber } from 'antd';

const { Option } = Select;


function EquipmentCalculatComponent({name, index, request_type, calculatedExpRate, form, setCurrency}) {

  const currencies = [
    'USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','SEK','NZD','NOK','SGD','KRW','TRY','MXN','INR','BRL','ZAR','HKD','RUB',
    'DKK','PLN','THB','IDR','HUF','CZK','ILS','CLP','PHP','AED','COP','MYR','RON','SAR','HRK','BGN','EGP','QAR','VND','ARS','NGN',
    'PKR','UAH','KWD','BDT','IQD','MAD','OMR','LKR','TWD',
  ];
  
  return (
    <Row gutter={[12, 12]}>
                   <Col lg={24} md={24} sm={24} xs={24}>
                   <h2><strong>To be filled by related department:</strong></h2>
                   </Col>
                   <Col lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      name={[name, `currency`]}
                      label="Currency"
                      rules={[
                        {
                          required: true,
                          message: 'Please select the currency',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Currency"
                        size="large"
                        onChange={(value) => {
                          console.log('Selected Currency:', value);
                          // setCurrency(value);
                          setCurrency({ currency_code: value, indexForm: index });
                        }}
                      >
                        {currencies.map((currency) => (
                          <Option key={currency} value={currency}>
                            {currency}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                   </Col>
 
                     <Col lg={8} md={8} sm={24} xs={24}>
                       <Form.Item
                         name={[name, 'amount']}
                         
                         label="Price"
                         rules={[
                           {
                             required: true,
                             message: 'Please enter the amount',
                           },
                         ]}
                       >
                         <InputNumber placeholder="Type Amount" size="large" min={0} style={{width:'100%'}}
                         onChange={(e) => {
                           const assetDetailFields = form.getFieldValue([request_type,index,'asset_details']);
                           assetDetailFields.forEach((fieldd, indexx) => {
                              calculatedExpRate(fieldd.qty_inventory, index, indexx, request_type);  
                            });
                          }}
                            formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/,/g, '')}
                          />
                       </Form.Item>
                     </Col>
 
                   <Col lg={8} md={8} sm={24} xs={24}>
                     <Form.Item
                       name={[name, 'rate']}
                     
                       label="Exchange Rate"
                       rules={[
                         {
                           required: true,
                           message: 'Please enter the exchange rate',
                         },
                       ]}
                     >
                       <InputNumber placeholder="Type Exchange Rate" size="large"  min={0} style={{width:'100%'}}
                        onChange={(e) => {
                         const assetDetailFields = form.getFieldValue([request_type,index,'asset_details']);
                         assetDetailFields.forEach((fieldd, indexx) => {
                            calculatedExpRate(fieldd.qty_inventory, index, indexx, request_type);  
                          });
                        }}
                        formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/,/g, '')}
                       />
                     </Form.Item>
                   </Col>
 
                  
                 </Row>
  )
}

export default EquipmentCalculatComponent
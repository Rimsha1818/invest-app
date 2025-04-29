import { Card, Col, Row, Tag } from 'antd'
import React from 'react'

function CurrencyShowComponent({data, crfSettingData}) {
  return (
    <Card
      title={<span style={{ fontSize: "14px" }}>To be filled by related department:</span>}
    >
      <Row>
             <Col xs={24} sm={12} md={8} lg={6} xl={6}>
             <p className="fs-12 mb-10">Currency</p>
             <Tag label="Currency">{data.currency}</Tag>
           </Col>
 
           <Col xs={24} sm={12} md={8} lg={6} xl={6}>
             <p className="fs-12 mb-10">Price</p>
             {/*<Tag label="Amount">{data.amount}</Tag>*/}
             <Tag label="Amount">  {parseFloat(data.amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>
           </Col>
 
           <Col xs={24} sm={12} md={8} lg={6} xl={6}>
             <p className="fs-12 mb-10">Exchange Rate</p>
             {/*<Tag label="Rate">{data.rate}</Tag>*/}
             <Tag label="Rate">  {parseFloat(data.rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>
           </Col>
 
           <Col xs={24} sm={12} md={8} lg={6} xl={6}>
             <p className="fs-12 mb-10" style={{fontWeight: 'bold'}}>Total ({crfSettingData?.data?.[0]?.crf_currency || 'PKR'})</p>
             <Tag label="Total">
               {parseFloat(data.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

               {/*{(parseFloat(data.total)).toFixed(2)}*/}
             </Tag>
             </Col>
             </Row>
    </Card>
  )
}

export default CurrencyShowComponent
import React from 'react'
import {
  Tag,
  Row,
  Col
} from 'antd';
function InventoryShowComponent({assetDetail, currency, crfSettingData}) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Request Type</p>
        <Tag>{assetDetail.request_type}</Tag>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Action</p>
        <Tag>{assetDetail.action}</Tag>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Inventory Status</p>
        <Tag>{assetDetail.inventory_status}</Tag>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Expected Expense ({crfSettingData?.data?.[0]?.crf_currency || 'PKR'})</p>
        {/*<Tag>{assetDetail.expected_expense}</Tag>*/}
        <Tag>{parseFloat(assetDetail.expected_expense).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>
      </Col>


      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Serial No</p>
        <Tag>{assetDetail.serial_no}</Tag>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Asset Code</p>
        <Tag>{assetDetail.asset_code}</Tag>
      </Col>


      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Qty</p>
        <Tag>{assetDetail.qty_inventory}</Tag>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Expected Expense ({currency})</p>
        {/*<Tag>{assetDetail.expected_expense_usd}</Tag>*/}
        <Tag>{parseFloat(assetDetail.expected_expense_usd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>
      </Col>


      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Remarks/Description</p>
        <Tag>{assetDetail.description}</Tag>
      </Col>
      

     {/* <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <p className="fs-12 mb-10">Remarks</p>
        <Tag>{assetDetail.remarks}</Tag>
      </Col>
      */}
    </Row>
  )
}

export default InventoryShowComponent
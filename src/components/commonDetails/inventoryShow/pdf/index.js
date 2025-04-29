import React from 'react'
import {
  Tag,
  Row,
  Col
} from 'antd';
function InventoryShowComponent({assetDetail, currency, crfSettingData}) {
  return (
    <Row gutter={[8, 8]}>

      <Col xs={24} sm={8} md={8} lg={8} xl={8}>
        <span className="fs-10 "><strong>Action</strong>&nbsp;</span>
        <Tag style={{fontSize:'10px', minWidth:'71%'}}>&nbsp;{assetDetail.action}</Tag>
      </Col>

      <Col xs={24} sm={8} md={8} lg={8} xl={8}>
        <span className="fs-10 "><strong>Inv Status</strong>&nbsp;</span>
        <Tag style={{fontSize:'10px', minWidth:'69%'}}>&nbsp;{assetDetail.inventory_status}</Tag>
      </Col>

      <Col xs={24} sm={8} md={8} lg={8} xl={8}>
        <span className="fs-10 "><strong>Expected Expense ({crfSettingData?.data?.[0]?.crf_currency || 'PKR'})</strong>&nbsp;</span>
        {/*<Tag style={{fontSize:'10px', minWidth:'35%'}}>&nbsp;{assetDetail.expected_expense}</Tag>*/}
        <Tag style={{fontSize:'10px', minWidth:'35%'}}>&nbsp;{parseFloat(assetDetail.expected_expense).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>
      </Col>


      <Col xs={24} sm={8} md={8} lg={8} xl={8}>
        <span className="fs-10 "><strong>Serial No</strong>&nbsp;</span>
        <Tag style={{fontSize:'10px', minWidth:'65%'}}>&nbsp;{assetDetail.serial_no}</Tag>
      </Col>

      <Col xs={24} sm={8} md={8} lg={8} xl={8}>
        <span className="fs-10 "><strong>Asset Code</strong>&nbsp;</span>
        <Tag style={{fontSize:'10px', minWidth:'65%'}}>&nbsp;{assetDetail.asset_code}</Tag>
      </Col>

      <Col xs={24} sm={3} md={3} lg={3} xl={3}>
        <span className="fs-10 "><strong>Qty</strong>&nbsp;</span>
        <Tag style={{fontSize:'10px', minWidth:'45%'}}>&nbsp;{assetDetail.qty_inventory}</Tag>
      </Col>

      <Col xs={24} sm={5} md={5} lg={5} xl={5}>
        <span className="fs-10 "><strong>({currency})</strong>&nbsp;</span>
        {/*<Tag style={{fontSize:'10px', minWidth:'62%'}}>&nbsp;{assetDetail.expected_expense_usd}</Tag>*/}
        <Tag style={{fontSize:'10px', minWidth:'65%'}}>&nbsp;{parseFloat(assetDetail.expected_expense_usd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>
      </Col>

      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <span className="fs-10 "><strong>Remarks/Description</strong>&nbsp;</span>
        <Tag style={{ fontSize: "10px", minWidth: "82%", minHeight: "35px" }}>&nbsp;{assetDetail.description}</Tag>
      </Col>

    </Row>
  )
}

export default InventoryShowComponent
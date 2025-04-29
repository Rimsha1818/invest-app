import React from 'react'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { TeamOutlined } from '@ant-design/icons';
import { Button, Col, Row, Card } from 'antd';
import Header from '../../components/header';

function QualityAssuranceRequest() {
  return (
    <DefaultLayout>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<TeamOutlined/>}
            title="Quality Assurance"
            right={(
              <Button className='btn-blue' type="primary">
                Quality Assurance Request
              </Button>
            )}
          />
        </Col>

      </Row>

      <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card style={{height: '100vh'}}>
          </Card>
        </Col>
      </Row>
      
        

    </DefaultLayout>
  )
}

export default QualityAssuranceRequest

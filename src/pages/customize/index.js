import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Table,
  Badge,
  Tabs,
  Card,
  notification,
  Spin,
  Modal,
} from 'antd';
import {
  DeleteOutlined, ExclamationCircleFilled, EyeOutlined, EditOutlined
} from '@ant-design/icons';
import { TeamOutlined, SettingTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DefaultLayout from './../../components/layout/DefaultLayout';
import Header from './../../components/header/index';
import { useMediaQuery } from 'react-responsive';
import Customizer from './../../components/customizer/index';


function Customize() {
  const [cardLoading, setCardLoading] = useState(false);

  return (
    <DefaultLayout >
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Header icon={<SettingTwoTone />} title="Customize Your Theme" />
          </Col>
        </Row>
        <Row gutter={[10, 10]} className="pt-20 pb-20">
          <Col lg={24} md={24} sm={24} xs={24}>
            <Spin spinning={cardLoading}>
              <Card style={{  }}>
                <Customizer />
              </Card>
            </Spin>
          </Col>
          
        </Row>
        
      </Card>
    </DefaultLayout>
  );
}

export default Customize;

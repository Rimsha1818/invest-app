import React from 'react';
import { Row, Col } from 'antd';
import EmptyLayout from './../../components/layout/EmptyLayout';
import DefaultLayout from '../../components/layout/DefaultLayout';

const PageNotFound = () => {
  return (
    <DefaultLayout>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col lg={13} className="box text-center">
          <h1>Page Not Found</h1>
          <p>
            Page doesn't exist in our system
          </p>
        </Col>
      </Row>
    </DefaultLayout>
  );
};

export default PageNotFound;

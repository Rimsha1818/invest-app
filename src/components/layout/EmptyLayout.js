import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import '../layout/index.css';
import logo from '../../assets/logo.png' ;

const { Content } = Layout;

const EmptyLayout = ({children}) => (
  <div style={{
    minHeight: '100vh',
  }}>
    <div className='container-fluid'>
    <div className="header mb-50">
        <Link to="/" className='mt-20'>
        <img src={logo} width="180" />
          </Link>
      </div>
    </div>
    <Layout className="mainLayout">
    <Content>
      <div className="container-fluid">{children}</div>
    </Content>
    
  </Layout>
  </div>
);
export default EmptyLayout;

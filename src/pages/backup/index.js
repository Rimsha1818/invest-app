import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Form, Input, Row, Col, Card } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import BackupList from "../../components/backup";

const Backup = () => {
  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header icon={<TeamOutlined />} title="Backups" />
        </Col>
      </Row>

      <Card>
        <BackupList />
      </Card>
    </DefaultLayout>
  );
};
export default Backup;

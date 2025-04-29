import React from "react";
import { Form, Row, Col, Input, Button, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";

const ActionsApprovalColumn = ({
  handleStatus,
  setRespondStatus,
  setPassData,
  record,
}) => {
  return (
    <Form onFinish={handleStatus}>
      <Row>
        <Col span={8}>
          <Form.Item
            name="message"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please provide a reason',
            //   },
            // ]}
          >
            <Input placeholder="Type Reason" />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Tooltip title="Approve">
          <span>
            <Button
              className="ml-4 mb-4"
              onClick={() => {
                setRespondStatus("Approved");
                setPassData(record);
              }}
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
            ></Button>
             </span>
          </Tooltip>
          <Tooltip title="Disapprove">
          <span>
            <Button
              className="ml-4 mr-4 mb-4"
              onClick={() => {
                setRespondStatus("Disapproved");
                setPassData(record);
              }}
              htmlType="submit"
              icon={<CloseCircleOutlined />}
            ></Button>
          </span>
          </Tooltip>
          <Tooltip title="Return">
          <span>
            <Button
              className="ml-3 mb-4"
              onClick={() => {
                setRespondStatus("Return");
                setPassData(record);
              }}
              htmlType="submit"
              icon={<UndoOutlined />}
            ></Button>
          </span>
          </Tooltip>
        </Col>
      </Row>
    </Form>
  );
};

export default ActionsApprovalColumn;

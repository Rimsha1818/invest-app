import React, { useState } from "react";
import {
  Calendar,
  Card,
  Modal,
  InputNumber,
  message,
  Typography,
  Row,
  Col,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Header from "../../components/header";
import dayjs from "dayjs";

const DailyProfitPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [profitValue, setProfitValue] = useState(null);
  const [profitModalVisible, setProfitModalVisible] = useState(false);
  const [dailyProfits, setDailyProfits] = useState({});

  const handleDateClick = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    setSelectedDate(dateStr);
    setProfitValue(dailyProfits[dateStr] || null);
    setProfitModalVisible(true);
  };

  const handleProfitSave = () => {
    if (profitValue === null || profitValue < 0) {
      message.error("Enter a valid profit percentage");
      return;
    }
    setDailyProfits((prev) => ({
      ...prev,
      [selectedDate]: profitValue,
    }));
    setProfitModalVisible(false);
    message.success("Profit saved");
  };

  const renderProfitCell = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const profit = dailyProfits[dateStr];
    return profit !== undefined ? (
      <div style={{ backgroundColor: "#e6f7ff", padding: "2px", borderRadius: "4px", textAlign: "center" }}>
        <Typography.Text type="success">{profit}%</Typography.Text>
      </div>
    ) : null;
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<TeamOutlined />}
            title="Daily Profit Calendar"
          />
        </Col>
      </Row>

      <Card>
        <Calendar dateCellRender={renderProfitCell} onSelect={handleDateClick} />
      </Card>

      <Modal
        title={`Add Profit for ${selectedDate}`}
        open={profitModalVisible}
        onCancel={() => setProfitModalVisible(false)}
        onOk={handleProfitSave}
        okText="Save"
      >
        <InputNumber
          min={0}
          max={100}
          addonAfter="%"
          value={profitValue}
          onChange={setProfitValue}
          placeholder="Enter profit %"
          style={{ width: "100%" }}
        />
      </Modal>
    </DefaultLayout>
  );
};

export default DailyProfitPage;

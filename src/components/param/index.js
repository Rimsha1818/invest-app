import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import paramService from "../../services/param";

export default function CompanyComponent({ onChange, value, all, type, compId }) {
  const [options, setOptions] = useState([]); // Store options for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await paramService.getParam(type, compId);

        const paramData = Array.isArray(response.data) ? response.data : [];

        
        const formattedOptions = paramData.flatMap((param) =>
          param.data.map((item, index) => ({
            id: `${item.value}-${item.description}`, 
            value: `${item.value}-${item.description}`,
            key: `${param.id}-${index}`, 
          }))
        );

        setOptions(formattedOptions);
      } catch (err) {
        console.error("Error fetching params:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParams();
  }, [type, compId, all]);

  if (loading) {
    return <Spin />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Select
      showSearch
      optionFilterProp="children"
      style={{ width: "100%" }}
      size="large"
      placeholder="Please Select"
      value={value}
      onChange={onChange}
      allowClear
      notFoundContent={options.length === 0 ? "No data found" : null}
    >
      {options.map((option) => (
        <Select.Option key={option.key} value={option.value}>
          {option.id} {/* Display "1-1312", "2-312312", etc. */}
        </Select.Option>
      ))}
    </Select>
  );
}

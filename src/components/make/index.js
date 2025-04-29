import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd'; // Import Spin for loading indicator
import makeService from '../../services/make';

export default function DepartmentComponent({ onChange, value, all }) {
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await makeService.getMakes();

        // Ensure data is an array, handle null/undefined safely
        const makeData = Array.isArray(response) ? response : [];
        console.log(response);

        setMakes(makeData);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err); // Set the error state
      } finally {
        setLoading(false);
      }
    };

    fetchMakes();
  }, [all]); // Add 'all' to the dependency array


  if (loading) {
    return <Spin />; // Display loading indicator
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message
  }


  return (
    <Select
      showSearch
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Make"
      value={value}
      onChange={onChange}
      allowClear
      notFoundContent={makes.length === 0 ? "No make found" : null} // Handle empty state
    >
      {makes.map((make) => (
        <Select.Option key={make.id} value={make.id}>
          {make.name}
        </Select.Option>
      ))}
    </Select>
  );
}
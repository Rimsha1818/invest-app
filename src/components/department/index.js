import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd'; // Import Spin for loading indicator
import departmentService from '../../services/department';

export default function DepartmentComponent({ onChange, value, all }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = all
          ? await departmentService.getAllDepartments()
          : await departmentService.getDepartments();

        // Ensure data is an array, handle null/undefined safely
        const departmentData = Array.isArray(response) ? response : [];
        console.log(response);

        setDepartments(departmentData);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err); // Set the error state
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
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
      placeholder="Please Select Department"
      value={value}
      onChange={onChange}
      allowClear
      notFoundContent={departments.length === 0 ? "No departments found" : null} // Handle empty state
    >
      {departments.map((department) => (
        <Select.Option key={department.id} value={department.id}>
          {department.name}
        </Select.Option>
      ))}
    </Select>
  );
}
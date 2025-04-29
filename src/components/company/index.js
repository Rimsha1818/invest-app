import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd'; // Import Spin for loading indicator
import companyService from '../../services/company';

export default function CompanyComponent({ onChange, value, all }) {
  const [comppanies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = all
          ? await companyService.getAllCompanies(1,500)
          : await companyService.getAllCompanies(1,500);

        // Ensure data is an array, handle null/undefined safely
        const companyData = Array.isArray(response.data) ? response.data : [];
        console.log('yes here');
        console.log(response);

        setCompanies(companyData);
      } catch (err) {
        console.error("Error fetching comppanies:", err);
        setError(err); // Set the error state
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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
      placeholder="Please Select Company"
      value={value}
      onChange={onChange}
      allowClear
      notFoundContent={comppanies.length === 0 ? "No comppanies found" : null} // Handle empty state
    >
      {comppanies.map((comp) => (
        <Select.Option key={comp.id} value={comp.id}>
          {comp.name}
        </Select.Option>
      ))}
    </Select>
  );
}
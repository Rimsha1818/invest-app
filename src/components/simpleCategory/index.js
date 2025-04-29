import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import categoryService from '../../services/category';
export default function SimpleCategoryComponent({ onChange, value, all }) {
  const [categories, setCategories] = useState(null);

  const getCategories = async () => {
    let response;
    if (all === true) {
      response = await categoryService.getAllCategories();
    } else {
      response = await categoryService.getCategories();
    }
    setCategories(response);
  };

  useEffect(() => {
    getCategories();
  }, []);

  console.log("this is Main categories -- > ",categories);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Category"
      value={value}
      onChange={onChange}
      allowClear
    >
      {categories &&
        categories.data.map((category) => (
          <Select.Option key={category.id} value={category.id}>
            {category.name}
          </Select.Option>
        ))}
    </Select>
  );
}

import React, { useState, useEffect } from 'react';
import { Select, Col, Form } from 'antd';
import categoryService from '../../services/category';

export default function CategoryComponent({ onChange, value, all }) {
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const getCategories = async () => {
    let response;
    if (all === true) {
      response = await categoryService.getAllCategories();
    } else {
      response = await categoryService.getCategories();
    }
    setCategories(response);
  };

  const onCategoryChange = async (value) => {
    onChange(value);
    try {
      const response = await categoryService.getCategoryById(value);
      setSubCategories(response.software_subcategories);
    } catch (error) {
      console.error('Error while fetching subCategories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Col lg={6} md={12} sm={24} xs={24}>
        <Form.Item name="software_category">
          <Select
            showSearch={true}
            optionFilterProp="children"
            style={{ width: '100%' }}
            size="large"
            placeholder="Please Select Category"
            value={value}
            onChange={onCategoryChange}
            allowClear
          >
            {categories &&
              categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Col>

      {subCategories && subCategories.length > 0 && (
        <Col lg={6} md={12} sm={24} xs={24}>
          <Form.Item name="software_subcategories">
            <Select
              showSearch={true}
              optionFilterProp="children"
              placeholder="Subcategory"
              allowClear={true}
              size="large"
            >
              {subCategories.map((subCategory) => (
                <Select.Option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
    </>
  );
}

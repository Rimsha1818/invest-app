import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import sectionService from '../../services/section';

export default function SectionComponent({ onChange, value, all }) {
  const [sections, setSections] = useState(null);

  const getSections = async () => {
    let response;
    if (all === true) {
      response = await sectionService.getAllSections();
    } else {
      response = await sectionService.getSections();
    }
    setSections(response);
  };

  useEffect(() => {
    getSections();
  }, []);

  return (
    <Select
      showSearch={true}
      optionFilterProp="children"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please Select Section"
      value={value}
      onChange={onChange}
      allowClear
    >
      {sections &&
        sections.map((section) => (
          <Select.Option key={section.id} value={section.id}>
            {section.name}
          </Select.Option>
        ))}
    </Select>
  );
}

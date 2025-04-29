import { Card, Space, Tag } from 'antd'
import React from 'react'

function CreatedByComponent({data}) {
  return (
    <Card>
              <Space direction="vertical">
                <div className="user-details mt-10">
                  <div className="user-name bold">
                    <div className="mb-5 fs-12-c">Created By</div>
                  </div>
                </div>
                {data && data.created_by && (
                  <>

                  <span className='capitalize fs-12-c'>name:</span>
                    <Tag className='capitalize'><strong>{data.created_by.name}</strong></Tag>
                    <span className='capitalize fs-12-c'>email:  </span>
                    <Tag><strong>{data.created_by.email}</strong></Tag>
                    <span className='capitalize fs-12-c'>employee no:</span>
                    <Tag><strong>{data.created_by.employee_no}</strong></Tag>
                    <span className='capitalize fs-12-c'>department:  </span>
                    <Tag><strong>{data.department.name}</strong></Tag>
                    <span className='capitalize fs-12-c'>section: </span>
                    <Tag><strong>{data.section?.name}</strong></Tag>
                    <span className='capitalize fs-12-c'>designtaion: </span>
                    <Tag><strong>{data.designation?.name}</strong></Tag>
                    Created date:
                    <Tag><strong>{data.created_at}</strong></Tag>
                  </>
                )}
              </Space>
            </Card>
  )
}

export default CreatedByComponent
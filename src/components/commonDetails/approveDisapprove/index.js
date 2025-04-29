import { Card, Form, Button, Input, Select } from "antd";
import React from "react";

function ApproveDisapproveComponent({
  handleStatus,
  loading,
  setStatus,
  parallel,
  parallelUsers,
  setAssignedUserId,
  reloadData,
}) {
  const [form] = Form.useForm(); // Create a form instance
  const [parallelForm] = Form.useForm(); // Create a separate form instance for parallel approvals

  const handleSubmit = (status) => {
    setStatus(status);
    form.submit(); // Submit the relevant form based on approval type
  };

  const handleParallelSubmit = (status) => {
    parallelForm.validateFields().then((values) => {
      setAssignedUserId(values.assigned_user_id);
      setStatus(status);
      parallelForm.submit();
    });
  };


  return (
    <Card className="mb-4">
      {!parallel && ( // Render the standard approval form when not parallel
        <Form
          form={form}
          onFinish={(values) =>
            handleStatus({ ...values, status: form.getFieldValue("status") })
          }
        >
          <Form.Item name="message">
            <Input.TextArea placeholder="Type Reason" rows={2} />
          </Form.Item>
          <Form.Item>
            <Button
              className="mr-4 mb-4"
              onClick={() => handleSubmit("Approved")}
              type="primary"
              loading={loading}
            >
              Approve
            </Button>
            <Button
              className="mr-4 mb-4"
              onClick={() => handleSubmit("Disapproved")}
              loading={loading}
            >
              Disapprove
            </Button>
            <Button
              className="mr-4 mb-4"
              onClick={() => handleSubmit("Return")}
              loading={loading}
            >
              Return
            </Button>
          </Form.Item>
        </Form>
      )}

      {parallel && ( // Render the parallel approval form
        <Form
          form={parallelForm}
          initialValues={{
            assigned_user_id: parallelUsers.length > 0 ? parallelUsers[0].id : undefined,
          }}
          onFinish={(values) =>
            handleStatus({
              ...values,
              status: parallelForm.getFieldValue("status"),
            })
          }
        >
          <Form.Item
            name="assigned_user_id"
            rules={[
              { required: true, message: "Please select the Parallel User" },
            ]}
          >
            <Select placeholder="Select Parallel User" size="large">
              {parallelUsers.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="message">
            <Input.TextArea placeholder="Type Reason" rows={2} />
          </Form.Item>
          <Form.Item>
            <Button
              className="mr-4 mb-4"
              onClick={() => handleParallelSubmit("Approved")}
              type="primary"
              loading={loading}
            >
              Approve
            </Button>
            <Button
              className="mr-4 mb-4"
              onClick={() => handleParallelSubmit("Disapproved")}
              loading={loading}
            >
              Disapprove
            </Button>
            <Button
              className="mr-4 mb-4"
              onClick={() => handleParallelSubmit("Return")}
              loading={loading}
            >
              Return
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}

export default ApproveDisapproveComponent;

import { Badge, Card, Space, Tooltip } from "antd";
import React from "react";
import { WarningOutlined, RollbackOutlined } from "@ant-design/icons";

function ApproversComponent({ approvers }) {
  return (
    <Card className="mt-20">
      <div className="mb-14 fs-12-c">
        <b>Approval Hierarchy</b>
      </div>

      <div className="mb-10 fs-12-c">
        <div>
          <Badge count={" "} color={"lightgray"} className="mr-4 mb-4" />{" "}
          Optional{" "}
        </div>

        <div>
          <Badge count={" "} color={"red"} className="mr-4 mb-4" /> Required{" "}
        </div>

        <br />

        <div>
          <Badge count={" "} color={"blue"} className="mr-4 mb-4" /> Processing{" "}
        </div>

        <div>
          <Badge count={" "} color={"yellow"} className="mr-4 mb-4" /> Awaiting{" "}
        </div>

        <div>
          <Badge count={" "} color={"green"} className="mr-4 mb-4" /> Approved{" "}
        </div>

        <div>
          <Badge count={<WarningOutlined />} className="ml-4 mr-10" />
          Disapproved
        </div>

        <div>
          <Badge count={<RollbackOutlined />} className="ml-4 mr-10" />
          Return
        </div>
      </div>
      {approvers &&
        approvers.map((approver, approverIndex) => (
          <Space
            direction="vertical"
            key={`approver_${approver.id}_${approverIndex}`}
            className="mt-24 mr-24"
          >
            <div>
              {/*   <div
                        className="mb-10 fs-12-c"
                        style={{ fontWeight: 'bold' }}
                      >
                        {approver.name}
                      </div>*/}

              {approver.users && approver.users.length > 0 && (
                <div className="mb-10 fs-12-c" style={{ fontWeight: "bold" }}>
                  {approver.name}
                </div>
              )}

              <div>
                {approver.users.map((user, userIndex) => (
                  <div
                    key={`user_${user.id}_${userIndex}`}
                    className="mb-4 fs-12-c"
                  >
                    <Badge
                      count={" "}
                      color={user.approval_required === 1 ? "red" : "lightgray"}
                      className="mr-4"
                    />
                    <>- </>

                    {user.status && (
                      <Badge
                        count={
                          (user.status === "Disapproved" && (
                            <WarningOutlined className="mr-4" />
                          )) ||
                          (user.status === "Return" && (
                            <RollbackOutlined className="mr-4" />
                          ))
                        }
                        color={
                          user.status === "Processing"
                            ? "blue"
                            : user.status === "Pending"
                            ? "yellow"
                            : user.status === "Approved"
                            ? "green"
                            : null
                        }
                        className="mr-4"
                      />
                    )}
                    <span style={{ fontSize: "12px" }}>
                      <Tooltip title={user.name}>
                        <span>{user.name.slice(0, 20)}...</span>
                      </Tooltip>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Space>
        ))}
    </Card>
  );
}

export default ApproversComponent;

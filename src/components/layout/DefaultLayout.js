import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Tooltip, Typography, Button, notification } from "antd";
import {
  LockFilled,
  UserOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  BranchesOutlined,
  AppstoreOutlined,
  DollarCircleOutlined,
  SolutionOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  EditFilled,
  SettingOutlined,
  TeamOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  ContactsOutlined,
  TagOutlined,
  UsergroupAddOutlined,
  FormOutlined,
  CheckOutlined,
  ProfileOutlined,
  LogoutOutlined,
  ApiOutlined,
  UserSwitchOutlined,
  KeyOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import ProfilePictureComponent from "./../profilePicture";
import impersonate from "../../services/impersonate";
import { loginStart, loginSuccess, loginFailure } from "../../redux/userSlice";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const DefaultLayout = ({ children }) => {
  const initialCollapsed =
    localStorage.getItem("menuCollapsed") === "true" ? true : false;
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [isVisible, setIsVisible] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FOR MOBILE
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 900;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setMobileMenuOpen(false); // close overlay on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // FOR MOBILE

  const impersonateUser = currentUser.impersonated_user === true ? true : false;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900 && !collapsed) {
        setCollapsed(true);
        setIsVisible(false);
      } else if (window.innerWidth >= 900 && collapsed) {
        setCollapsed(false);
        setIsVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [collapsed]);

  const switchBack = async () => {
    console.log("yes here clicked on switch back");
    dispatch(loginStart());
    try {
      const response = await impersonate.impersonateStop();
      console.log("yeh haiii ", response);
      if (response.current_user) {
        response.current_user.token = response.current_user.token;
        localStorage.setItem("token", response.current_user?.token);

        console.log(response.current_user.token);

        dispatch(loginSuccess(response.current_user));
        notification.success({
          message: "Account Switched",
          description: response.message,
        });
      }
    } catch (error) {
      dispatch(loginFailure());
      console.log(error);
      notification.error({
        message: "Error",
        description: error,
      });
    } finally {
    }
  };

  useEffect(() => {
    localStorage.setItem("menuCollapsed", collapsed);
  }, [collapsed]);

  const handleLogout = () => {
    // localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (location.state && location.state.prevUrl) {
      navigate(location.state.prevUrl, { replace: true });
    }
  }, [location, navigate]);

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <Menu.Item key={item.id || `${item.key}-${item.route}`} icon={item.icon}>
        <Link to={item.route}>{item.label}</Link>
      </Menu.Item>
    ));
  };

  const userManagement = [
    {
      key: "Role",
      icon: <ApartmentOutlined />,
      label: "Roles",
      route: "/roles",
    },
    {
      key: "User",
      icon: <UserOutlined />,
      label: "User Data",
      route: "/users",
    },
    {
      key: "ParallelApprover",
      icon: <UserSwitchOutlined />,
      label: "Parallel Approvers",
      route: "/parallel-approvers",
    },
  ];

  const formMenuItems = [
    {
      key: "SoftwareChangeRequestForm",
      icon: <FileTextOutlined />,
      label: "Software Change Request Form",
      route: "/scrf",
    },
    {
      key: "CapitalRequestForm",
      icon: <SolutionOutlined />,
      label: "Capital Request Form",
      route: "/crf",
    },
    {
      key: "QualityAssurance",
      icon: <SafetyCertificateOutlined />,
      label: "Quality Assurance Form",
      route: "/quality-assurance",
    },
    {
      key: "deployment",
      icon: <ExclamationCircleOutlined />,
      label: "Deployment",
      route: "/deployment",
    },

    {
      key: "MobileRequisition",
      icon: <ExclamationCircleOutlined />,
      label: "Mobile Requisition Form",
      route: "/mobile-requisition",
    },
    {
      key: "MasterDataManagementForm",
      icon: <ExclamationCircleOutlined />,
      label: "Master Data Management",
      route: "/master-data-management-form",
    },
    {
      key: "MasterDataManagementForm",
      icon: <ExclamationCircleOutlined />,
      label: "Deployment Form",
      route: "/deployment",
    },
    {
      key: "SapAccessForm",
      icon: <FileTextOutlined />,
      label: "SAP Access Form",
      route: "/sap-access-form",
    },
    {
      key: "SupportDeskForm",
      icon: <AppstoreAddOutlined />,
      label: "Request Support Form",
      route: "/support-desk-form",
    },
  ];

  const configPermissionMenuItems = [
    {
      key: "CostCenter",
      icon: <DollarCircleOutlined />,
      label: "Cost Center",
      route: "/cost-center",
    },
    {
      key: "CostCenter",
      icon: <AppstoreAddOutlined />,
      label: "MDM Project",
      route: "/mdm-project",
    },
    {
      key: "CrfSetting",
      icon: <DollarCircleOutlined />,
      label: "Crf Settings",
      route: "/crf-settings",
    },

    {
      key: "Equipment",
      icon: <ApiOutlined />,
      label: "Equipments",
      route: "/equipments",
    },
  ];

  const serviceDeskMenuItems = [
    {
      key: "ServiceDesk",
      icon: <BellOutlined />,
      label: "Service Desk",
      route: "/service-desk",
    },
    {
      key: "ServiceDesk",
      icon: <BellOutlined />,
      label: "Request Support Desk",
      route: "/request-support-desk",
    },
    {
      key: "AssignTask",
      icon: <UserSwitchOutlined />,
      label: "Assigned Tasks",
      route: "/assign-task",
    },
    {
      key: "AutoAssignTask",
      icon: <UserSwitchOutlined />,
      label: "Auto Assign Task",
      route: "/auto-assign-task",
    },
  ];

  const menuItems = [
    {
      key: "Department",
      icon: <TeamOutlined />,
      label: "Departments",
      route: "/departments",
    },
    {
      key: "Service",
      icon: <AppstoreAddOutlined />,
      label: "Parameters",
      route: "/params",
    },
    {
      key: "Service",
      icon: <AppstoreAddOutlined />,
      label: "Projects",
      route: "/projects",
    },
    {
      key: "Section",
      icon: <AppstoreAddOutlined />,
      label: "Sections",
      route: "/sections",
    },
    {
      key: "SoftwareCategory",
      icon: <TagOutlined />,
      label: "Categories",
      route: "/categories",
    },
    {
      key: "SoftwareSubcategory",
      icon: <AppstoreOutlined />,
      label: "Subcategories",
      route: "/software-subcategories",
    },
    {
      key: "Designation",
      icon: <ContactsOutlined />,
      label: "Designations",
      route: "/designations",
    },
    {
      key: "Location",
      icon: <EnvironmentOutlined />,
      label: "Locations",
      route: "/locations",
    },
    {
      key: "BusinessExpert",
      icon: <TeamOutlined />,
      label: "Business Expert",
      route: "/business-expert",
    },
    {
      key: "Subscribers",
      icon: <UsergroupAddOutlined />,
      label: "Subscribers",
      route: "/subscribers",
    },
    {
      key: "Approvers",
      icon: <CheckOutlined />,
      label: "Approvers",
      route: "/approvers",
    },
    {
      key: "Department",
      icon: <AppstoreAddOutlined />,
      label: "Makes",
      route: "/makes",
    },
    {
      key: "MdmCategory",
      icon: <AppstoreAddOutlined />,
      label: "Mdm Categories",
      route: "/mdm-categories",
    },
    {
      key: "MdmCategory",
      icon: <AppstoreAddOutlined />,
      label: "Companies",
      route: "/companies",
    },
    {
      key: "Service",
      icon: <AppstoreAddOutlined />,
      label: "Services",
      route: "/services",
    },
    {
      key: "Service",
      icon: <AppstoreAddOutlined />,
      label: "Link Services with Department",
      route: "/department-services",
    },
    {
      key: "Service",
      icon: <AppstoreAddOutlined />,
      label: "Link Teams with Service",
      route: "/service-teams",
    },
    // {
    //   key: "Service",
    //   icon: <AppstoreAddOutlined />,
    //   label: "Parameters",
    //   route: "/params",
    // },
  ];

  const allowedPermissions =
    currentUser?.["roles.permission"]?.map((permission) => permission.name) ||
    [];
  //console.log(allowedPermissions)
  const filteredMenuItems = menuItems.filter((item) =>
    allowedPermissions.includes(`${item.key}-view`)
  );
  const filteredUserManagementItems = userManagement.filter((item) =>
    allowedPermissions.includes(`${item.key}-view`)
  );
  const filteredConfigurationMenuItems = configPermissionMenuItems.filter(
    (item) => allowedPermissions.includes(`${item.key}-view`)
  );
  const filteredServiceDeskMenuItems = serviceDeskMenuItems.filter((item) =>
    allowedPermissions.includes(`${item.key}-view`)
  );
  const filteredFormMenuItems = formMenuItems.filter((item) =>
    allowedPermissions.includes(`${item.key}-view`)
  );

  return (
    <>
      <Layout hasSider>
        {/* FOR MOBILE */}
        {isMobile && !isMobileMenuOpen && (
          <Button
            icon={<MenuUnfoldOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            style={{
              position: "fixed",
              top: 2,
              left: 2,
              zIndex: 2000,
            }}
          />
        )}
        {/* FOR MOBILE */}

        {!isMobile && (
          <Sider trigger={null} collapsible collapsed={collapsed}>
            {!collapsed && (
              <>
                <div className="user-profile">
                  {currentUser && (
                    <ProfilePictureComponent
                      user_id={currentUser?.user_id}
                      size={80}
                    />
                  )}
                  <div className="mt-10">
                    <Typography className="mb-10">
                      {currentUser?.name}
                    </Typography>
                    <small>
                      <Tooltip title="Edit Profile">
                        <Link to="/profile" className="fs-16 mr-4">
                          <EditFilled />
                        </Link>
                      </Tooltip>
                    </small>
                    <small>
                      <Tooltip title="Change Password">
                        <Link to="/password" className="fs-16 mr-4">
                          <LockFilled />
                        </Link>
                      </Tooltip>
                    </small>
                    <small>
                      <Tooltip title="Logout">
                        <Link className="fs-16 mr-4" onClick={handleLogout}>
                          <LogoutOutlined />
                        </Link>
                      </Tooltip>
                    </small>
                  </div>

                  {impersonateUser && (
                    <div className="mt-10 mb-0">
                      <Button
                        icon={<SwapOutlined />}
                        onClick={() => switchBack()}
                        style={{
                          width: "auto",
                          height: 30,
                        }}
                      >
                        Switch Back
                      </Button>
                    </div>
                  )}

                  {currentUser?.roles?.includes("admin") && !impersonateUser && (
                    <div className="mt-10 mb-0">
                      <Button
                        icon={<SwapOutlined />}
                        onClick={() => navigate("/switch-user")}
                        style={{
                          width: "auto",
                          height: 30,
                        }}
                      >
                        Switch User
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            <Menu selectedKeys={[location.pathname]}>
              {" "}
              {/* Only one <Menu> */}
              <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              {/* User Management SubMenu */}
              {filteredUserManagementItems.length > 0 && (
                <SubMenu
                  key="userManagement" // Unique key for SubMenu
                  title="USER MANAGEMENT"
                  icon={<BranchesOutlined />}
                >
                  {renderMenuItems(filteredUserManagementItems)}
                </SubMenu>
              )}
              {/* Configurations SubMenu */}
              {filteredConfigurationMenuItems.length > 0 && (
                <SubMenu
                  key="configurations" // Unique key for SubMenu
                  title="CONFIGURATIONS"
                  icon={<KeyOutlined />}
                >
                  {renderMenuItems(filteredConfigurationMenuItems)}

                  {/* Admin-specific Menu Items (with unique keys) */}
                  {currentUser?.roles?.includes("admin") && (
                    <>
                      <Menu.Item key="admin-forms" icon={<FormOutlined />}>
                        <Link to="/forms">Forms</Link>
                      </Menu.Item>

                      <Menu.Item
                        key="admin-formPermissions"
                        icon={<KeyOutlined />}
                      >
                        <Link to="/form-permissions">Form Permissions</Link>
                      </Menu.Item>

                      <Menu.Item
                        key="assignPermissionLink"
                        icon={<UserSwitchOutlined />}
                      >
                        <Link to="/assign-permission">
                          Assign Form Permissions
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="workflowLink" icon={<ProfileOutlined />}>
                        <Link to="/workflow">Workflow</Link>
                      </Menu.Item>

                      <Menu.Item
                        key="withoutWorkflow"
                        icon={<ProfileOutlined />}
                      >
                        <Link to="/without_workflow">Without Workflow</Link>
                      </Menu.Item>

                      <Menu.Item key="team-group" icon={<SolutionOutlined />}>
                        <Link to="/team-group ">Create Team</Link>
                      </Menu.Item>

                      <Menu.Item key="team-member" icon={<SolutionOutlined />}>
                        <Link to="/team-member ">Assign Team Members</Link>
                      </Menu.Item>

                      <Menu.Item key="settings" icon={<SettingOutlined />}>
                        <Link to="/settings ">System Settings</Link>
                      </Menu.Item>

                      <Menu.Item key="customize" icon={<SettingOutlined />}>
                        <Link to="/customize ">Theme Customizer</Link>
                      </Menu.Item>
                    </>
                  )}
                </SubMenu>
              )}
              {filteredMenuItems.length > 0 && (
                <SubMenu
                  key="SETUP FIELDS"
                  title="SETUP FIELDS"
                  icon={<BranchesOutlined />}
                >
                  {renderMenuItems(filteredMenuItems)}
                </SubMenu>
              )}
              {filteredFormMenuItems.length > 0 && (
                <SubMenu key="FORMS" title="FORMS" icon={<FormOutlined />}>
                  {renderMenuItems(filteredFormMenuItems)}
                </SubMenu>
              )}
            </Menu>

            <Menu>
              {filteredServiceDeskMenuItems.length > 0 && (
                <SubMenu
                  key="SERVICE DESK"
                  title="SERVICE DESK"
                  icon={<BranchesOutlined />}
                >
                  {renderMenuItems(filteredServiceDeskMenuItems)}
                </SubMenu>
              )}

              {collapsed && (
                <>
                  <Menu.Item key="profile" icon={<EditFilled />}>
                    <Link to="/profile" className="fs-16 mr-4">
                      profile
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="password" icon={<LockFilled />}>
                    <Link to="/password" className="fs-16 mr-4">
                      Password
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="dashboard" icon={<LogoutOutlined />}>
                    <Link onClick={handleLogout}>Logout</Link>
                  </Menu.Item>

                  {!isMobile && (
                    <Button
                      type="text"
                      className={isVisible === true ? "" : "menuButton"}
                      icon={
                        collapsed ? (
                          <MenuUnfoldOutlined />
                        ) : (
                          <MenuFoldOutlined />
                        )
                      }
                      onClick={() => setCollapsed(!collapsed)}
                      style={{
                        fontSize: "16px",
                        width: 30,
                        height: 30,
                        position: "absolute",
                      }}
                    />
                  )}
                </>
              )}
            </Menu>
            {!isMobile && (
              <Button
                type="text"
                className={isVisible === true ? "" : "menuButton"}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 30,
                  height: 30,
                  position: "absolute",
                }}
              />
            )}
          </Sider>
        )}

        <Content
          style={{
            padding: "0 0px 0 0",
            minHeight: "100% !important",
          }}
        >
          {children}
        </Content>
      </Layout>

      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "90vw",
            height: "100vh",
            background: "#001529", // Antd Sider color
            zIndex: 1999,
            padding: "10px 0px",
            overflowY: "auto",
            color: "#fff",
          }}
        >
          <Button
            icon={<MenuFoldOutlined />}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 2001,
            }}
          />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            style={{ borderRight: 0 }}
            onClick={() => setMobileMenuOpen(false)} // close on menu click
          >
            <div className="user-profile" style={{ padding: "0px" }}>
              <div className="mt-10">
                <Typography
                  className="mb-10"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  {currentUser?.name}
                </Typography>
                <small>
                  <Tooltip title="Edit Profile">
                    <Link to="/profile" className="fs-16 mr-4">
                      <EditFilled className="text-white" />
                      &nbsp;
                    </Link>
                  </Tooltip>
                </small>
                <small>
                  <Tooltip title="Change Password">
                    <Link to="/password" className="fs-16 mr-4">
                      <LockFilled className="text-white" />
                      &nbsp;
                    </Link>
                  </Tooltip>
                </small>
                <small>
                  <Tooltip title="Logout">
                    <Link className="fs-16 mr-4" onClick={handleLogout}>
                      <LogoutOutlined className="text-white" />
                      &nbsp;
                    </Link>
                  </Tooltip>
                </small>
              </div>
            </div>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>

            {/* USER MANAGEMENT */}
            {filteredUserManagementItems.length > 0 && (
              <SubMenu
                key="userMobile"
                title="User Management"
                icon={<BranchesOutlined />}
              >
                {renderMenuItems(filteredUserManagementItems)}
              </SubMenu>
            )}

            {/* CONFIGURATIONS */}
            {filteredConfigurationMenuItems.length > 0 && (
              <SubMenu
                key="configurations" // Unique key for SubMenu
                title="CONFIGURATIONS"
                icon={<KeyOutlined />}
              >
                {renderMenuItems(filteredConfigurationMenuItems)}

                {/* Admin-specific Menu Items (with unique keys) */}
                {currentUser?.roles?.includes("admin") && (
                  <>
                    <Menu.Item key="admin-forms" icon={<FormOutlined />}>
                      <Link to="/forms">Forms</Link>
                    </Menu.Item>

                    <Menu.Item
                      key="admin-formPermissions"
                      icon={<KeyOutlined />}
                    >
                      <Link to="/form-permissions">Form Permissions</Link>
                    </Menu.Item>

                    <Menu.Item
                      key="assignPermissionLink"
                      icon={<UserSwitchOutlined />}
                    >
                      <Link to="/assign-permission">
                        Assign Form Permissions
                      </Link>
                    </Menu.Item>

                    <Menu.Item key="workflowLink" icon={<ProfileOutlined />}>
                      <Link to="/workflow">Workflow</Link>
                    </Menu.Item>

                    <Menu.Item key="withoutWorkflow" icon={<ProfileOutlined />}>
                      <Link to="/without_workflow">Without Workflow</Link>
                    </Menu.Item>

                    <Menu.Item key="team-group" icon={<SolutionOutlined />}>
                      <Link to="/team-group ">Create Team</Link>
                    </Menu.Item>

                    <Menu.Item key="team-member" icon={<SolutionOutlined />}>
                      <Link to="/team-member ">Assign Team Members</Link>
                    </Menu.Item>

                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                      <Link to="/settings ">System Settings</Link>
                    </Menu.Item>

                    <Menu.Item key="customize" icon={<SettingOutlined />}>
                      <Link to="/customize ">Theme Customizer</Link>
                    </Menu.Item>
                  </>
                )}
              </SubMenu>
            )}

            {/* SETUP FIELDS */}
            {filteredMenuItems.length > 0 && (
              <SubMenu
                key="SETUP FIELDS"
                title="SETUP FIELDS"
                icon={<BranchesOutlined />}
              >
                {renderMenuItems(filteredMenuItems)}
              </SubMenu>
            )}

            {/* FORMS */}
            {filteredFormMenuItems.length > 0 && (
              <SubMenu key="FORMS" title="FORMS" icon={<FormOutlined />}>
                {renderMenuItems(filteredFormMenuItems)}
              </SubMenu>
            )}

            {/* SERVICE DESK */}
            {filteredServiceDeskMenuItems.length > 0 && (
              <SubMenu
                key="SERVICE DESK"
                title="SERVICE DESK"
                icon={<BranchesOutlined />}
              >
                {renderMenuItems(filteredServiceDeskMenuItems)}
              </SubMenu>
            )}
          </Menu>
        </div>
      )}
    </>
  );
};

export default DefaultLayout;

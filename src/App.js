import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.scss";

import Login from "./pages/login";
import UsersData from "./pages/users";
import Departments from "./pages/departments";
import Sections from "./pages/sections";
import PageNotFound from "./pages/pageNotFound/index";
import Categories from "./pages/categories";
import Subscribers from "./pages/subscribers";
import Scrf from "./pages/scrf";
import ApprovalPage from "./pages/approval";
import FormInitiator from "./pages/FormInitiator";
import WorkFlow from "./pages/workflow";
import Forms from "./pages/forms";
import Profile from "./pages/profile";
import Password from "./pages/password";
import Designations from "./pages/designations";
import SubCategories from "./pages/subcategories";
import Locations from "./pages/locations";
import BusinessExpert from "./pages/businessExpert";
import ScrfDetails from "./pages/scrf/details";
import Roles from "./pages/roles";
import { useSelector } from "react-redux";
import Dashboard from "./pages/dashboard";
import FormPermissions from "./pages/formPermissions";
import ParallelApprovers from "./pages/parallelApprovers";
import ServiceDesk from "./pages/serviceDesk";
import Settings from "./pages/settings";
import AssignPermission from "./pages/formPermissions/assignPermission";
import TeamGroup from "./pages/team";
import TeamMember from "./pages/teamMembers";
import PostEquipmentRequest from "./pages/equipmentRequest/form";
import CostCenter from "./pages/costCenter";
import Equipments from "./pages/equipments";
import GetEquipmentRequest from "./pages/equipmentRequest";
import EquipmentRequestDetails from "./pages/equipmentRequest/details";
import Tasks from "./pages/tasks";
import QualityAssurance from "./pages/qualityAssuranceForm/index";
import QualityAssuranceDetails from "./pages/qualityAssuranceForm/details";
import QualityAssuranceRequest from "./pages/qualityAssuranceRequest";
import ScrfForm from "./pages/scrf/form";
import QualityAssuranceForm from "./pages/qualityAssuranceForm/form";
import MobileRequisitionForm from "./pages/mobileRequisition/form";
import MobileRequisition from "./pages/mobileRequisition";
import MobileRequisitionDetails from "./pages/mobileRequisition/details";
import EmailLogs from "./pages/emailLog";
import Backup from "./pages/backup";

import MdmForm from "./pages/masterDataManagementForm/form";
import Mdm from "./pages/masterDataManagementForm";
import MdmDetails from "./pages/masterDataManagementForm/details";
// import BackupDownload from './components/backup/BackupDownload';
import CustomizerPage from "./pages/customize/index";
import Customizer from "./components/customizer";

// Deployment Form
import DeploymentForm from "./pages/deploymentForm/form";
import Deployment from "./pages/deploymentForm";
import DeploymentDetails from "./pages/deploymentForm/details";

import Makes from "./pages/makes";
import MdmCat from "./pages/mdmCategory";
import useSessionCheck from './useSessionCheck';

import WorkFlowEdit from "./pages/workflow/edit";

import CompanyData from "./pages/companies";

import SafForm from "./pages/sapAccessForm/form";
import Saf from "./pages/sapAccessForm";
import SafDetails from "./pages/sapAccessForm/details";

import SdfForm from "./pages/supportDeskForm/form";
import Sdf from "./pages/supportDeskForm";
import SdfDetails from "./pages/supportDeskForm/details";

import Services from "./pages/services";
import DepartmentServices from "./pages/departmentservices";
import ServiceTeams from "./pages/serviceteams";

import ParamsData from "./pages/params";

import RequestSupport from "./pages/requestSupport";

import AdvanceSettings from "./pages/advanceSettings";

import ActivityLog from "./pages/activityLog";

import IpSettings from "./pages/ipSettings";

import CallbackData from "./pages/callbacks";
import LoginWithoutIp from "./pages/loginWithoutIp";

import CrfSettings from "./pages/crfSettings";

import MdmProject from "./pages/mdmProject";
import Subscriptions from "./pages/subscriptions";

import Projects from "./pages/projects";
import WithoutWorkflow from "./pages/withoutWorkflow";

import AutoTasks from "./pages/autoTasks";

import SwitchUser from "./pages/switchUser";


const ThemeContext = createContext({
  theme: "light", // Default theme
  setTheme: () => {}, // Function to update the theme
});
function App() {
  useSessionCheck();
  const [theme, setTheme] = useState("light");
  const { currentUser } = useSelector((state) => state.user);
  const allowedPermissions = currentUser?.["roles.permission"]?.map(
    (permission) => permission.name
  );
  const hasPermission = (permission) =>
    allowedPermissions?.includes(permission);
  const isAuthenticated = !!localStorage.getItem("token");
  const RedirectToLogin = () => {
    const location = useLocation();
    return (
      <Navigate
        to="/login"
        state={{ prevUrl: location.pathname + location.search }}
        replace
      />
    );
  };

  const RedirectToLoginWithoutIP = () => {
    const location = useLocation();
    return (
      <Navigate
        to="/loginSupAdmin"
        state={{ prevUrl: location.pathname + location.search }}
        replace
      />
    );
  };
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light"); // Switch between light and dark themes
  };

  useEffect(() => {
    const savedStyles = localStorage.getItem("userStyles");
    if (savedStyles) {
      const style = document.createElement("style");
      style.id = "dynamic-styles";
      style.innerHTML = savedStyles;
      document.head.appendChild(style); // Inject the saved styles
    }
  }, []);
  return (
    <div className="App">
      <ThemeContext.Provider value={{ theme, setTheme }}>
          <Routes>
            <Route path="/loginSupAdmin" element={<LoginWithoutIp />} />
          
            <Route path="/" exact element={<Login />} />
            <Route path="/login" exact element={<Login />} />
            <Route
              path="/users"
              element={
                isAuthenticated && hasPermission("User-view") ? (
                  <UsersData />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/roles"
              element={
                isAuthenticated && hasPermission("Role-view") ? (
                  <Roles />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/sections"
              element={
                isAuthenticated && hasPermission("Section-view") ? (
                  <Sections />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/departments"
              element={
                isAuthenticated && hasPermission("Department-view") ? (
                  <Departments />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/categories"
              element={
                isAuthenticated && hasPermission("SoftwareCategory-view") ? (
                  <Categories />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/locations"
              element={
                isAuthenticated && hasPermission("Location-view") ? (
                  <Locations />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/business-expert"
              element={
                isAuthenticated && hasPermission("BusinessExpert-view") ? (
                  <BusinessExpert />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/subscribers"
              element={
                isAuthenticated && hasPermission("Subscribers-view") ? (
                  <Subscribers />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/scrf"
              element={isAuthenticated ? <Scrf /> : <RedirectToLogin />}
            />
            <Route
              path="/scrf/add"
              element={isAuthenticated ? <ScrfForm /> : <RedirectToLogin />}
            />
            <Route
              path="/scrf/edit/:id"
              element={isAuthenticated ? <ScrfForm /> : <RedirectToLogin />}
            />
            <Route
              path="/scrf/details/:id"
              element={isAuthenticated ? <ScrfDetails /> : <RedirectToLogin />}
            />
            <Route
              path="/approvers"
              element={
                isAuthenticated && hasPermission("Approvers-view") ? (
                  <ApprovalPage />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/form-initiator"
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <FormInitiator />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/workflow"
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <WorkFlow />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/forms"
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <Forms />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/email-logs"
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <EmailLogs />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/designations"
              element={
                isAuthenticated && hasPermission("Designation-view") ? (
                  <Designations />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/software-subcategories"
              element={
                isAuthenticated && hasPermission("SoftwareSubcategory-view") ? (
                  <SubCategories />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/assign-permission"
              element={
                isAuthenticated ? <AssignPermission /> : <RedirectToLogin />
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <RedirectToLogin />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <RedirectToLogin />}
            />
            <Route
              path="/password"
              exact
              element={isAuthenticated ? <Password /> : <RedirectToLogin />}
            />
            <Route
              path="/form-permissions"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <FormPermissions />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/parallel-approvers"
              exact
              element={
                isAuthenticated ? <ParallelApprovers /> : <RedirectToLogin />
              }
            />
            <Route
              path="/service-desk"
              exact
              element={isAuthenticated ? <ServiceDesk /> : <RedirectToLogin />}
            />
            <Route
              path="/quality-assurance"
              exact
              element={
                isAuthenticated ? <QualityAssurance /> : <RedirectToLogin />
              }
            />
            <Route
              path="/get-qa-assigned/add"
              exact
              element={
                isAuthenticated ? <QualityAssuranceForm /> : <RedirectToLogin />
              }
            />
            <Route
              path="/quality-assurance/details/:id"
              exact
              element={
                isAuthenticated ? (
                  <QualityAssuranceDetails />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/quality-assurance/edit/:id"
              exact
              element={
                isAuthenticated ? <QualityAssuranceForm /> : <RedirectToLogin />
              }
            />
            <Route
              path="/quality-assurance/request"
              exact
              element={
                isAuthenticated ? (
                  <QualityAssuranceRequest />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/settings"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <Settings />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/team-group"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <TeamGroup />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/team-member"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <TeamMember />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/crf/add"
              exact
              element={
                isAuthenticated ? <PostEquipmentRequest /> : <RedirectToLogin />
              }
            />
            <Route
              path="/crf/edit/:id"
              exact
              element={
                isAuthenticated ? <PostEquipmentRequest /> : <RedirectToLogin />
              }
            />
            <Route
              path="/crf/details/:id"
              exact
              element={
                isAuthenticated ? (
                  <EquipmentRequestDetails />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/crf"
              exact
              element={
                isAuthenticated ? <GetEquipmentRequest /> : <RedirectToLogin />
              }
            />
            <Route
              path="/equipments"
              exact
              element={
                isAuthenticated && hasPermission("Equipment-view") ? (
                  <Equipments />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/cost-center"
              exact
              element={
                isAuthenticated && hasPermission("CostCenter-view") ? (
                  <CostCenter />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/assign-task"
              exact
              element={isAuthenticated ? <Tasks /> : <RedirectToLogin />}
            />
            <Route
              path="/mobile-requisition/add"
              exact
              element={
                isAuthenticated ? (
                  <MobileRequisitionForm />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/mobile-requisition/edit/:id"
              exact
              element={
                isAuthenticated ? (
                  <MobileRequisitionForm />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/mobile-requisition"
              exact
              element={
                isAuthenticated ? <MobileRequisition /> : <RedirectToLogin />
              }
            />
            <Route
              path="/mobile-requisition/details/:id"
              exact
              element={
                isAuthenticated ? (
                  <MobileRequisitionDetails />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/backups"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <Backup />
                ) : (
                  <Login />
                )
              }
            />
            {/* <Route path="/backups/download/:fileName" element={<BackupDownload />} /> */}
            <Route
              path="/master-data-management-form"
              element={isAuthenticated ? <Mdm /> : <RedirectToLogin />}
            />
            <Route
              path="/master-data-management-form/add"
              element={isAuthenticated ? <MdmForm /> : <RedirectToLogin />}
            />
            <Route
              path="/master-data-management-form/edit/:id"
              element={isAuthenticated ? <MdmForm /> : <RedirectToLogin />}
            />
            <Route
              path="/master-data-management-form/details/:id"
              element={isAuthenticated ? <MdmDetails /> : <RedirectToLogin />}
            />
            <Route
              path="/customize/"
              element={
                isAuthenticated ? <CustomizerPage /> : <RedirectToLogin />
              }
            />
            <Route
              path="/deployment"
              element={isAuthenticated ? <Deployment /> : <RedirectToLogin />}
            />
            <Route
              path="/deployment/add"
              element={
                isAuthenticated ? <DeploymentForm /> : <RedirectToLogin />
              }
            />
            <Route
              path="/deployment/edit/:id"
              element={
                isAuthenticated ? <DeploymentForm /> : <RedirectToLogin />
              }
            />
            <Route
              path="/deployment/details/:id"
              element={
                isAuthenticated ? <DeploymentDetails /> : <RedirectToLogin />
              }
            />

            <Route
              path="/makes"
              element={
                isAuthenticated && hasPermission("Department-view") ? (
                  <Makes />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/mdm-categories"
              element={
                isAuthenticated && hasPermission("MdmCategory-view") ? (
                  <MdmCat />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/workflow-edit"
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <WorkFlowEdit />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/companies"
              element={
                isAuthenticated ? <CompanyData /> : <RedirectToLogin />
              }
            />
            <Route
              path="/sap-access-form"
              element={isAuthenticated ? <Saf /> : <RedirectToLogin />}
            />
            <Route
              path="/sap-access-form/add"
              element={isAuthenticated ? <SafForm /> : <RedirectToLogin />}
            />
            <Route
              path="/sap-access-form/edit/:id"
              element={isAuthenticated ? <SafForm /> : <RedirectToLogin />}
            />
            <Route
              path="/sap-access-form/details/:id"
              element={isAuthenticated ? <SafDetails /> : <RedirectToLogin />}
            />
            <Route
              path="/support-desk-form"
              element={isAuthenticated ? <Sdf /> : <RedirectToLogin />}
            />
            <Route
              path="/support-desk-form/add"
              element={isAuthenticated ? <SdfForm /> : <RedirectToLogin />}
            />
            <Route
              path="/support-desk-form/edit/:id"
              element={isAuthenticated ? <SdfForm /> : <RedirectToLogin />}
            />
            <Route
              path="/support-desk-form/details/:id"
              element={isAuthenticated ? <SdfDetails /> : <RedirectToLogin />}
            />
            <Route
              path="/services"
              element={
                isAuthenticated && hasPermission("Service-view") ? (
                  <Services />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/department-services"
              element={
                isAuthenticated && hasPermission("Service-view") ? (
                  <DepartmentServices />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/service-teams"
              element={
                isAuthenticated && hasPermission("Service-view") ? (
                  <ServiceTeams />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            <Route
              path="/params"
              element={
                isAuthenticated ? <ParamsData /> : <RedirectToLogin />
              }
            />
            <Route
              path="/request-support-desk"
              exact
              element={isAuthenticated ? <RequestSupport /> : <RedirectToLogin />}
            />

             <Route
              path="/advance-settings"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <AdvanceSettings />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/activity-log"
              element={
                isAuthenticated ? <ActivityLog /> : <RedirectToLogin />
              }
            />

            <Route
              path="/ip-settings"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <IpSettings />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/callbacks"
              element={
                isAuthenticated ? <CallbackData /> : <RedirectToLogin />
              }
            />

            <Route
              path="/crf-settings"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <CrfSettings />
                ) : (
                  <RedirectToLogin />
                )
              }
            />
            
            <Route
              path="/mdm-project"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <MdmProject />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

           <Route
              path="/projects"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <Projects />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/without_workflow"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <WithoutWorkflow />
                ) : (
                  <RedirectToLogin />
                )
              }
            />


             <Route
              path="/subscriptions"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <Subscriptions />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/auto-assign-task"
              exact
              element={isAuthenticated && hasPermission("AutoAssignTask-view") ? <AutoTasks /> : <RedirectToLogin />}
            />
            
            <Route
              path="/switch-user"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <SwitchUser />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="*"
              exact
              element={isAuthenticated && <PageNotFound />}
            />
          </Routes>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;

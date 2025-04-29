import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.scss';

import Login from './pages/login';
import UsersData from './pages/users';
import Departments from './pages/departments';
import Sections from './pages/sections';
import PageNotFound from './pages/pageNotFound/index';
import Categories from './pages/categories';
import Subscribers from './pages/subscribers';
import Scrf from './pages/scrf';
import ApprovalPage from './pages/approval';
import FormInitiator from './pages/FormInitiator';
import WorkFlow from './pages/workflow';
import Forms from './pages/forms';
import Profile from './pages/profile';
import Password from './pages/password';
import Designations from './pages/designations';
import SubCategories from './pages/subcategories';
import Locations from './pages/locations';
import BusinessExpert from './pages/businessExpert';
import ScrfDetails from './pages/scrf/details';
import Roles from './pages/roles';
import { useSelector } from 'react-redux';
import Dashboard from './pages/dashboard';
import FormPermissions from './pages/formPermissions';
import ParallelApprovers from './pages/parallelApprovers';
import ServiceDesk from './pages/serviceDesk';
import Settings from './pages/settings';
import AssignPermission from './pages/formPermissions/assignPermission';
import TeamGroup from './pages/team';
import TeamMember from './pages/teamMembers';
import PostEquipmentRequest from './pages/equipmentRequest/form';
import CostCenter from './pages/costCenter';
import Equipments from './pages/equipments';
import GetEquipmentRequest from './pages/equipmentRequest';
import EquipmentRequestDetails from './pages/equipmentRequest/details';
import Tasks from './pages/tasks';
import QualityAssurance from './pages/qualityAssuranceForm/index';
import QualityAssuranceDetails from './pages/qualityAssuranceForm/details';
import QualityAssuranceRequest from './pages/qualityAssuranceRequest';
import ScrfForm from './pages/scrf/form';
import QualityAssuranceForm from './pages/qualityAssuranceForm/form';
import MobileRequisitionForm from './pages/mobileRequisition/form';
import MobileRequisition from './pages/mobileRequisition';
import Backup from './pages/backup';
import MobileRequisitionDetails from './pages/mobileRequisition/details';

function App() {

  const { currentUser } = useSelector((state) => state.user);
  const allowedPermissions = currentUser?.['roles.permission']?.map((permission) => permission.name);
  const hasPermission = (permission) => allowedPermissions?.includes(permission);
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path='/' exact element={<Login />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/users' element={isAuthenticated && hasPermission('User-view') ? <UsersData /> : <Navigate to="/" replace />} />
        <Route path='/roles' element={isAuthenticated && hasPermission('Role-view') ? <Roles /> :  <Navigate to="/" replace />} />
        <Route path='/sections' element={isAuthenticated && hasPermission('Section-view') ? <Sections /> : <Login />} />
        <Route path='/departments' element={isAuthenticated && hasPermission('Department-view') ? <Departments /> : <Login />} />
        <Route path='/categories' element={isAuthenticated && hasPermission('SoftwareCategory-view') ? <Categories /> : <Login />} />
        <Route path='/locations' element={isAuthenticated && hasPermission('Location-view') ? <Locations /> : <Login />} />
        <Route path='/business-expert' element={isAuthenticated && hasPermission('BusinessExpert-view') ? <BusinessExpert /> : <Login />} />
        <Route path='/subscribers' element={isAuthenticated && hasPermission('Subscribers-view') ? <Subscribers /> : <Login />} />
        <Route path='/scrf' element={isAuthenticated ? <Scrf /> : <Login />} />
        <Route path='/scrf/add' element={isAuthenticated ? <ScrfForm /> : <Login />} />
        <Route path='/scrf/edit/:id' element={isAuthenticated ? <ScrfForm /> : <Login />} />
        <Route path='/scrf/details/:id' element={isAuthenticated ? <ScrfDetails /> : <Login />} />
        <Route path='/approvers' element={isAuthenticated && hasPermission('Approvers-view') ? <ApprovalPage /> : <Login />} />
        <Route path='/form-initiator' element={isAuthenticated && currentUser.roles.includes('admin') ? <FormInitiator /> : <Login />} />
        <Route path='/workflow'  element={isAuthenticated && currentUser.roles.includes('admin') ? <WorkFlow /> : <Login />} />
        <Route path='/forms' element={isAuthenticated && currentUser.roles.includes('admin') ? <Forms /> : <Login />} />
        <Route path='/designations' element={isAuthenticated && hasPermission('Designation-view') ? <Designations /> : <Login />} />
        <Route path='/software-subcategories' element={isAuthenticated && hasPermission('SoftwareSubcategory-view') ? <SubCategories /> : <Login />} />
        <Route path='/assign-permission' element={isAuthenticated ? <AssignPermission /> : <Login />} />
        <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Login />} />
        <Route path='/profile' element={isAuthenticated ? <Profile /> : <Login />} />
        <Route path='/password' exact element={isAuthenticated ? <Password /> : <Login />} />
        <Route path='/form-permissions' exact element={isAuthenticated && currentUser.roles.includes('admin') ? <FormPermissions /> : <Login />} />
        <Route path='/parallel-approvers' exact element={isAuthenticated ? <ParallelApprovers /> : <Login />} />
        <Route path='/service-desk' exact element={isAuthenticated ? <ServiceDesk /> : <Login />} />
        <Route path='/quality-assurance' exact element={isAuthenticated ? <QualityAssurance /> : <Login />} />
        <Route path='/quality-assurance/add' exact element={isAuthenticated ? <QualityAssuranceForm /> : <Login />} />
        <Route path='/quality-assurance/details/:id' exact element={isAuthenticated ? <QualityAssuranceDetails /> : <Login />} />
        <Route path='/quality-assurance/edit/:id' exact element={isAuthenticated ? <QualityAssuranceForm /> : <Login />} />
        <Route path='/quality-assurance/request' exact element={isAuthenticated ? <QualityAssuranceRequest /> : <Login />} />
        <Route path='/settings' exact element={isAuthenticated && currentUser.roles.includes('admin') ? <Settings /> : <Login />} />
        <Route path='/team-group' exact element={isAuthenticated && currentUser.roles.includes('admin') ? <TeamGroup /> : <Login />} />
        <Route path='/team-member' exact element={isAuthenticated && currentUser.roles.includes('admin') ? <TeamMember /> : <Login />} />
        <Route path='/crf/add' exact element={isAuthenticated ? <PostEquipmentRequest /> : <Login />} />
        <Route path='/crf/edit/:id' exact element={isAuthenticated ? <PostEquipmentRequest /> : <Login />} />
        <Route path='/crf/details/:id' exact element={isAuthenticated ? <EquipmentRequestDetails /> : <Login />} />
        <Route path='/crf' exact element={isAuthenticated ? <GetEquipmentRequest /> : <Login />} />
        <Route path='/equipments' exact element={isAuthenticated && hasPermission('Equipment-view') ? <Equipments /> : <Login />} />
        <Route path='/cost-center' exact element={isAuthenticated && hasPermission('CostCenter-view') ? <CostCenter /> : <Login />} />
        <Route path='/assign-task' exact element={isAuthenticated ? <Tasks /> : <Login />} />
        <Route path='/mobile-requisition/add' exact element={isAuthenticated ? <MobileRequisitionForm /> : <Login />} />
        <Route path='/mobile-requisition/edit/:id' exact element={isAuthenticated ? <MobileRequisitionForm /> : <Login />} />
        <Route path='/mobile-requisition' exact element={isAuthenticated ? <MobileRequisition /> : <Login />} />
        <Route path='/backups' exact element={isAuthenticated && currentUser.roles.includes('admin') ? <Backup /> : <Login />} />
        <Route path='/mobile-requisition/details/:id' exact element={isAuthenticated ? <MobileRequisitionDetails /> : <Login />} />
        <Route path='*' exact element={isAuthenticated && <PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

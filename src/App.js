import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.scss";

// General Pages
import Login from "./pages/login";
import UsersData from "./pages/users";
import Departments from "./pages/departments";
import PageNotFound from "./pages/pageNotFound/index";
import Categories from "./pages/categories";
import Profile from "./pages/profile";
import Password from "./pages/password";
import Designations from "./pages/designations";
import SubCategories from "./pages/subcategories";
import Locations from "./pages/locations";
import Roles from "./pages/roles";
import { useSelector } from "react-redux";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import CustomizerPage from "./pages/customize/index";
import Customizer from "./components/customizer";
import CompanyData from "./pages/companies";
// IMPERSONATE
import SwitchUser from "./pages/switchUser";
// SESSION CHECK
import useSessionCheck from './useSessionCheck';
import ManageInvestment from "./pages/manageInvestment";
import DailyProfit from "./pages/dailyProfit";

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
              path="/customize/"
              element={
                isAuthenticated ? <CustomizerPage /> : <RedirectToLogin />
              }
            />
            <Route
              path="/companies"
              element={
                isAuthenticated ? <CompanyData /> : <RedirectToLogin />
              }
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
              path="/manage-investment"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <ManageInvestment />
                ) : (
                  <RedirectToLogin />
                )
              }
            />

            <Route
              path="/daily-profit"
              exact
              element={
                isAuthenticated && currentUser.roles.includes("admin") ? (
                  <DailyProfit />
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

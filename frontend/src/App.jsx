import React, { useContext, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AppContext } from "./context/AppContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import DriverDashboard from "./pages/DriverDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SystemLogs from "./pages/SystemLogs";
import PostLoad from "./pages/PostLoad";
import PostTruck from "./pages/PostTruck";

const getRole = (user) => user?.role || localStorage.getItem("role") || "customer";

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AppContext);
  const currentRole = getRole(user);

  if (!user) return <Navigate to="/login" />;
  if (role && currentRole !== role) return <Navigate to="/" />;

  return children;
};

/* ================= ROOT REDIRECT ================= */
const RootRedirect = () => {
  const { user } = useContext(AppContext);

  if (!user) return <Navigate to="/login" />;

  const role = getRole(user);

  switch (role) {
    case "superadmin":
      return <Navigate to="/superadmin" />;
    case "admin":
      return <Navigate to="/admin" />;
    case "driver":
      return <Navigate to="/driver" />;
    default:
      return <Navigate to="/dashboard" />;
  }
};

/* ================= APP ================= */
const App = () => {
  const { user } = useContext(AppContext);

  const showNavbar = useMemo(() => Boolean(user), [user]);

  return (
    <Router>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
        <Route path="/register" element={user ? <RootRedirect /> : <Register />} />
        <Route path="/forgot-password" element={user ? <RootRedirect /> : <ForgotPassword />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-load"
          element={
            <ProtectedRoute role="customer">
              <PostLoad />
            </ProtectedRoute>
          }
        />

        {/* Driver */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-truck"
          element={
            <ProtectedRoute role="driver">
              <PostTruck />
            </ProtectedRoute>
          }
        />

        {/* Super Admin */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute role="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/logs"
          element={
            <ProtectedRoute role="superadmin">
              <SystemLogs />
            </ProtectedRoute>
          }
        />

        {/* Root */}
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
};

export default App;

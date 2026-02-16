import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Sensor from "./pages/admin/Sensor.jsx";
import Market from "./pages/admin/Market.jsx";
import Advisory from "./pages/admin/Advisory.jsx";


function Protected({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ✅ This prevents "auto logout" when route doesn't exist
function RedirectByAuth() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
}

function DashboardPage() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
  path="/sensor"
  element={
    <Protected>
      <AdminLayout>
        <Sensor />
      </AdminLayout>
    </Protected>
  }
/>

<Route
  path="/market"
  element={
    <Protected>
      <AdminLayout>
        <Market />
      </AdminLayout>
    </Protected>
  }
/>

<Route
  path="/advisory"
  element={
    <Protected>
      <AdminLayout>
        <Advisory />
      </AdminLayout>
    </Protected>
  }
/>


        {/* ✅ Default fallback */}
        <Route path="*" element={<RedirectByAuth />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

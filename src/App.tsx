import React from "react";
import logo from "./logo.svg";
import "./output.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./layout/Layout";
import SignInPage from "./pages/SIgnInPage";
import MyAccount from "./pages/MyAccount";
import AttendanceReport from "./pages/AttendanceReport";
import APItest from "./pages/APItest";
import LayoutHR from "./layout/LayoutHR";
import DashboardHR from "./pages/DashboardHR";
import UserAccount from "./pages/UserAccount";
import AdminLogin from "./pages/AdminLogin";
import VerifyApi from "./pages/VerifyApi";
import DashboardAdmin from "./pages/DashboardAdmin";
import AddToPlatform from "./pages/AddToPlatformPage";
import AdminRegister from "./pages/AdminRegister";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<SignInPage />}></Route>
        <Route path="/api/login" element={<AdminLogin />}></Route>
        <Route path="/api/verify" element={<VerifyApi />}></Route>
       
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route element={<LayoutHR />}>
          <Route path="/HR/Dashboard" element={<DashboardHR />}></Route>
          <Route path="/HR/student" element={<UserAccount />}></Route>
          <Route path="/HR/week_register" element={<AdminRegister />}></Route>
          <Route path="/HR/platform_add" element={<AddToPlatform />}></Route>
          <Route path="/HR/add_user" element={<DashboardAdmin />}></Route>
        </Route>

        <Route element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route
            path="/AttendanceReport"
            element={<AttendanceReport />}
          ></Route>
          <Route path="/MyAccount" element={<MyAccount />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

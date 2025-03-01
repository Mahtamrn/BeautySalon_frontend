import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/pages/login/Login";
import Dashboard from "./assets/pages/dashboard/Dashboard";
import Services from "./assets/pages/salonservices/Services";
import Profile from "./assets/pages/profile/Profile";
import Navbar from "./assets/navigationBar/Navbar";
import Users from "./assets/pages/users/RegisteredUsers";
import WorkSchedule from "./assets/pages/workSchedule/WorkSchedule";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/work-schedule" element={<WorkSchedule />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

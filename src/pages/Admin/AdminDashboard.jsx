import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminSummary from './AdminSummary';
import AccessLogs from './AccessLogs';
import FabricLogs from './FabricLogs';
import './AdminDashboard.scss';
import SystemHealth from './SystemHealth';

const AdminDashboard = () => {
  return (
    <div className="adminContainer">
      <AdminSidebar />
      <div className="adminContent">
        <Routes>
          <Route path="/" element={<AdminSummary />} />
          <Route path="/access-logs" element={<AccessLogs />} />
          <Route path="/fabric-logs" element={<FabricLogs />} />
          <Route path="/system-health" element={<SystemHealth />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

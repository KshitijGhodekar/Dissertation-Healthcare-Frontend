import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import Summary from './Summary';
import PatientRecords from './PatientRecords';
import DoctorSettings from './DoctorSettings';
import './DoctorDashboard.scss';
import RequestPatientData from './RequestPatientData';

const DoctorDashboard = () => {
  return (
    <div className="doctorContainer">
      <DoctorSidebar />
      <div className="doctorContent">
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/requests" element={<RequestPatientData />} />
          <Route path="/records" element={<PatientRecords />} />
          <Route path="/settings" element={<DoctorSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorDashboard;

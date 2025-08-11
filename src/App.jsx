import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import Summary from "./pages/Doctor/Summary";
import RequestPatientData from "./pages/Doctor/RequestPatientData";
import PatientRecords from "./pages/Doctor/PatientRecords";
import DoctorSettings from "./pages/Doctor/DoctorSettings";
import AccessLogs from "./pages/Admin/AccessLogs";
import FabricLogs from "./pages/Admin/FabricLogs";
import Requests from "./pages/Admin/AdminSummary";
import SystemHealth from "./pages/Admin/SystemHealth";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/doctor" element={<DoctorDashboard />}>
          <Route index element={<Summary />} />
          <Route path="requests" element={<RequestPatientData />} />
          <Route path="records" element={<PatientRecords />} />
          <Route path="settings" element={<DoctorSettings />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="/admin/access-logs" element={<AccessLogs />} />
          <Route path="/admin/fabric-logs" element={<FabricLogs />} />
          <Route path="/admin/system-health" element={<SystemHealth />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

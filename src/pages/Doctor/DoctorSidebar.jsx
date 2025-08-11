import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserMd, FaUserInjured, FaFileMedical, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './DoctorSidebar.scss';

const DoctorSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('doctorToken');
      sessionStorage.clear();
      navigate('/'); 
    }
  };

  return (
    <div className="doctorSidebar">
      <div className="sidebar-header">
        <div className="doctor-avatar">
          <FaUserMd size={40} />
        </div>
        <h2>Doctor Panel</h2>
      </div>
      
      <nav>
        <ul>
          <li>
            <NavLink to="/doctor" end className={({isActive}) => isActive ? "active" : ""}>
              <FaHome className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctor/requests" className={({isActive}) => isActive ? "active" : ""}>
              <FaUserInjured className="nav-icon" />
              <span>Patient Requests</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctor/records" className={({isActive}) => isActive ? "active" : ""}>
              <FaFileMedical className="nav-icon" />
              <span>Patient Records</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctor/settings" className={({isActive}) => isActive ? "active" : ""}>
              <FaCog className="nav-icon" />
              <span>Settings</span>
            </NavLink>
          </li>
          <li className="logout-item">
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt className="nav-icon" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DoctorSidebar;
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaUserCog, 
  FaShieldAlt, 
  FaNetworkWired, 
  FaFileAlt, 
  FaHeartbeat, 
  FaSignOutAlt, 
  FaTachometerAlt 
} from 'react-icons/fa';
import './AdminSidebar.scss';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      navigate('/'); 
    }
  };

  return (
    <div className="adminSidebar">
      <div className="sidebar-header">
        <div className="admin-avatar">
          <FaUserCog size={40} />
        </div>
        <h2>Admin Panel</h2>
      </div>
      
      <nav>
        <ul>
          <li>
            <NavLink to="/admin" end className={({isActive}) => isActive ? "active" : ""}>
              <FaTachometerAlt className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/fabric-logs" className={({isActive}) => isActive ? "active" : ""}>
              <FaNetworkWired className="nav-icon" />
              <span>Fabric Logs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/access-logs" className={({isActive}) => isActive ? "active" : ""}>
              <FaShieldAlt className="nav-icon" />
              <span>Access Logs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/system-health" className={({isActive}) => isActive ? "active" : ""}>
              <FaHeartbeat className="nav-icon" />
              <span>System Health</span>
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

export default AdminSidebar;

import React, { useState, useEffect } from 'react';
import './SystemHealth.scss';
import { getSystemStatus } from '../../services/api';

const SystemHealth = () => {
  const [systemStatus, setSystemStatus] = useState({
    kafka: false,
    fabric: false,
    loading: true
  });
  const [notifications, setNotifications] = useState([]);
  const [initialized, setInitialized] = useState(false); // track first run

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const data = await getSystemStatus();
        console.log("Fetched status:", data);

        // Always show notification on first fetch or when status changes
        if (!initialized || data.kafka !== systemStatus.kafka) {
          setNotifications(prev => [
            ...prev,
            {
              id: Date.now() + "-kafka",
              type: data.kafka ? 'success' : 'error',
              message: data.kafka
                ? 'Kafka connection established'
                : 'Kafka connection lost',
              timestamp: new Date()
            }
          ]);
        }

        if (!initialized || data.fabric !== systemStatus.fabric) {
          setNotifications(prev => [
            ...prev,
            {
              id: Date.now() + "-fabric",
              type: data.fabric ? 'success' : 'error',
              message: data.fabric
                ? 'Fabric connection established'
                : 'Fabric connection lost',
              timestamp: new Date()
            }
          ]);
        }

        setSystemStatus({
          kafka: data.kafka,
          fabric: data.fabric,
          loading: false
        });

        if (!initialized) setInitialized(true);

      } catch (error) {
        console.error('Error fetching system status:', error);
        setSystemStatus({
          kafka: false,
          fabric: false,
          loading: false
        });

        // Notify both services as down on error
        if (!initialized) {
          setNotifications(prev => [
            ...prev,
            { id: Date.now() + "-kafka", type: 'error', message: 'Kafka connection lost', timestamp: new Date() },
            { id: Date.now() + "-fabric", type: 'error', message: 'Fabric connection lost', timestamp: new Date() }
          ]);
          setInitialized(true);
        }
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 10000);

    return () => clearInterval(interval);
  }, [systemStatus.kafka, systemStatus.fabric, initialized]);

  return (
    <div className="system-health-container">
      <h2>System Health Dashboard</h2>
      
      {/* Notifications */}
      {notifications.slice(-2).map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
          <span className="notification-time">
            {notification.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
      
      <div className="status-display">
        <div className="system-block system-a">
          <h3>System A</h3>
          <p>Hospital Management</p>
        </div>
        
        <div className="connectors">
          <div className={`connector ${systemStatus.kafka ? 'active' : 'inactive'}`}>
            <div className="connector-label">Kafka</div>
            <div className="status-indicator">
              <span className={`status-dot ${systemStatus.kafka ? 'active' : 'inactive'}`}></span>
              {systemStatus.kafka ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className={`connector ${systemStatus.fabric ? 'active' : 'inactive'}`}>
            <div className="connector-label">Hyperledger Fabric</div>
            <div className="status-indicator">
              <span className={`status-dot ${systemStatus.fabric ? 'active' : 'inactive'}`}></span>
              {systemStatus.fabric ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        <div className="system-block system-b">
          <h3>System B</h3>
          <p>Hospital Management</p>
        </div>
      </div>
      
      <div className="status-messages">
        <div className={`status-message ${systemStatus.fabric ? 'active' : 'inactive'}`}>
          Fabric is currently {systemStatus.fabric ? 'operational' : 'down'}
        </div>
        <div className={`status-message ${systemStatus.kafka ? 'active' : 'inactive'}`}>
          Kafka is currently {systemStatus.kafka ? 'operational' : 'down'}
        </div>
      </div>
      
      <div className="last-updated">
        Last updated: {new Date().toLocaleTimeString()}
        {systemStatus.loading && <span className="loading-spinner"></span>}
      </div>
    </div>
  );
};

export default SystemHealth;

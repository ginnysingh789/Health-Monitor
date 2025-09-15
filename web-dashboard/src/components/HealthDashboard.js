import React from 'react';
import './HealthDashboard.css';

const HealthDashboard = ({ data }) => {
  if (!data) {
    return (
      <div className="card health-dashboard">
        <h2>📊 Health Metrics</h2>
        <div className="no-data">
          <p>🔄 Waiting for sensor data...</p>
          <p>Start the simulation to see real-time health metrics</p>
        </div>
      </div>
    );
  }

  const getHeartRateStatus = (hr) => {
    if (hr < 60) return { status: 'warning', text: 'Low' };
    if (hr > 100) return { status: 'warning', text: 'High' };
    return { status: 'normal', text: 'Normal' };
  };

  const getSpo2Status = (spo2) => {
    if (spo2 < 90) return { status: 'critical', text: 'Critical' };
    if (spo2 < 95) return { status: 'warning', text: 'Low' };
    return { status: 'normal', text: 'Normal' };
  };

  const getTempStatus = (temp) => {
    if (temp > 100.4) return { status: 'warning', text: 'Fever' };
    if (temp < 97) return { status: 'warning', text: 'Low' };
    return { status: 'normal', text: 'Normal' };
  };

  const hrStatus = getHeartRateStatus(data.heart_rate);
  const spo2Status = getSpo2Status(data.spo2);
  const tempStatus = getTempStatus(data.temperature);

  return (
    <div className="card health-dashboard">
      <h2>📊 Health Metrics</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-info">
            <h3>Heart Rate</h3>
            <div className="metric-value">
              {data.heart_rate} <span className="unit">bpm</span>
            </div>
            <div className={`metric-status status-${hrStatus.status}`}>
              {hrStatus.text}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🫁</div>
          <div className="metric-info">
            <h3>Blood Oxygen</h3>
            <div className="metric-value">
              {data.spo2} <span className="unit">%</span>
            </div>
            <div className={`metric-status status-${spo2Status.status}`}>
              {spo2Status.text}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌡️</div>
          <div className="metric-info">
            <h3>Temperature</h3>
            <div className="metric-value">
              {data.temperature} <span className="unit">°F</span>
            </div>
            <div className={`metric-status status-${tempStatus.status}`}>
              {tempStatus.text}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚶</div>
          <div className="metric-info">
            <h3>Activity</h3>
            <div className="metric-value activity-value">
              {data.activity_level}
            </div>
            <div className="metric-status status-normal">
              Active
            </div>
          </div>
        </div>
      </div>

      <div className="device-info">
        <div className="device-status">
          <span className="device-icon">📱</span>
          <span>Device Connected</span>
        </div>
        <div className="battery-info">
          <span className="battery-icon">🔋</span>
          <span>{data.battery_level}%</span>
        </div>
        <div className="last-update">
          <span className="time-icon">⏰</span>
          <span>Last update: {new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {data.fall_detected && (
        <div className="fall-alert">
          <div className="fall-icon">🚨</div>
          <div className="fall-message">
            <strong>FALL DETECTED!</strong>
            <p>Emergency services have been notified</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;

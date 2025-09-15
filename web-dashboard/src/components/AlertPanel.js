import React from 'react';
import './AlertPanel.css';

const AlertPanel = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'critical': return '⚠️';
      case 'warning': return '⚡';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getAlertClass = (type) => {
    return `alert-item alert-${type}`;
  };

  return (
    <div className="card alert-panel">
      <h2>🔔 Alerts & Notifications</h2>
      
      {alerts.length === 0 ? (
        <div className="no-alerts">
          <p>✅ No alerts at this time</p>
          <p>All systems normal</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.slice().reverse().map((alert) => (
            <div key={alert.id} className={getAlertClass(alert.type)}>
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-content">
                <div className="alert-message">
                  {alert.message}
                </div>
                <div className="alert-time">
                  {alert.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="alert-summary">
        <div className="summary-item">
          <span className="summary-label">Total Alerts:</span>
          <span className="summary-value">{alerts.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Critical:</span>
          <span className="summary-value critical">
            {alerts.filter(a => a.type === 'critical' || a.type === 'emergency').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;

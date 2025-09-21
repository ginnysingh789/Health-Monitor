import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import './Hospitals.css';

function Hospitals() {
  // Critical alerts state
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      patientId: 'P1001', 
      patientName: 'John Doe', 
      type: 'critical', 
      message: 'Critical heart rate detected (180 BPM). Immediate medical attention required.', 
      location: '123 Main St, Emergency Room',
      time: '2 mins ago', 
      status: 'unread' 
    },
    { 
      id: 2, 
      patientId: 'P1003', 
      patientName: 'Sarah Smith', 
      type: 'warning', 
      message: 'High blood pressure alert (180/110 mmHg). Monitor closely.', 
      location: '456 Oak Ave, Room 205',
      time: '15 mins ago', 
      status: 'read' 
    },
    { 
      id: 3, 
      patientId: 'P1005', 
      patientName: 'Mike Johnson', 
      type: 'emergency', 
      message: 'Fall detected in room 312! Possible injury reported.', 
      location: '789 Pine St, Room 312',
      time: '1 hour ago', 
      status: 'unread' 
    },
  ]);

  // Hospital stats
  const [stats, setStats] = useState({
    totalBeds: 150,
    occupiedBeds: 128,
    availableBeds: 22,
    doctorsOnDuty: 18,
    nursesOnDuty: 42,
    criticalPatients: 5
  });

  // Available ambulances
  const [ambulances, setAmbulances] = useState([
    { id: 'AMB-001', status: 'available', location: 'Main Garage', eta: '5 mins' },
    { id: 'AMB-002', status: 'on-call', location: 'Downtown', eta: '15 mins' },
    { id: 'AMB-003', status: 'available', location: 'East Wing', eta: '2 mins' },
  ]);

  // Mark alert as read
  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'read' } : alert
    ));
  };

  // Dismiss alert
  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // View alert location on maps
  const viewOnMaps = (location) => {
    // In a real app, this would open a maps application with the location
    alert(`Opening maps with location: ${location}`);
  };

  // Assign ambulance to alert
  const assignAmbulance = (alertId, ambulanceId) => {
    // In a real app, this would dispatch the ambulance
    const ambulance = ambulances.find(amb => amb.id === ambulanceId);
    if (ambulance) {
      alert(`Ambulance ${ambulanceId} has been dispatched to the alert. ETA: ${ambulance.eta}`);
      // Update ambulance status
      setAmbulances(ambulances.map(amb => 
        amb.id === ambulanceId ? { ...amb, status: 'dispatched' } : amb
      ));
      // Update alert status
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'assigned', assignedAmbulance: ambulanceId } : alert
      ));
    }
  };

  return (
    <div className="hospital-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>🏥 City General Hospital</h1>
          <p className="hospital-location">📍 123 Medical Center Drive, Health City, HC 12345</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <span className="icon">📞</span> Emergency Call
          </button>
          <Link to="/" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛏️</div>
          <div className="stat-details">
            <span className="stat-value">{stats.availableBeds}/{stats.totalBeds}</span>
            <span className="stat-label">Beds Available</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-details">
            <span className="stat-value">{stats.doctorsOnDuty}</span>
            <span className="stat-label">Doctors On Duty</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👩‍⚕️</div>
          <div className="stat-details">
            <span className="stat-value">{stats.nursesOnDuty}</span>
            <span className="stat-label">Nurses On Duty</span>
          </div>
        </div>
        
        <div className="stat-card critical">
          <div className="stat-icon">⚠️</div>
          <div className="stat-details">
            <span className="stat-value">{stats.criticalPatients}</span>
            <span className="stat-label">Critical Patients</span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              ambulances={ambulances}
              onMarkAsRead={markAsRead}
              onDismiss={dismissAlert}
              onViewOnMap={viewOnMaps}
              onAssignAmbulance={assignAmbulance}
            />
          ))
        ) : (
          <div className="no-alerts">No active alerts at the moment.</div>
        )}
      </div>
    </div>
  );
}

export default Hospitals;
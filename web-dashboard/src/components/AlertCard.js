import React, { useState } from 'react';
import './AlertCard.css';

const AlertCard = ({ 
  alert, 
  ambulances, 
  onMarkAsRead, 
  onDismiss, 
  onViewOnMap, 
  onAssignAmbulance 
}) => {
  const [showAmbulancePopup, setShowAmbulancePopup] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);

  const handleAssignClick = (ambulanceId) => {
    setSelectedAmbulance(ambulanceId);
    onAssignAmbulance(alert.id, ambulanceId);
    setShowAmbulancePopup(false);
  };
  return (
    <div className={`alert-card ${alert.status} ${alert.type}`}>
      <div className="alert-icon">
        {alert.type === 'critical' ? '⚠️' : alert.type === 'emergency' ? '🚨' : 'ℹ️'}
      </div>
      <div className="alert-content">
        <div className="alert-header">
          <h4>{alert.patientName} <span className="patient-id">({alert.patientId})</span></h4>
          <span className="alert-time">{alert.time}</span>
        </div>
        <p>{alert.message}</p>
        


        {/* Action Buttons */}
        <div className="alert-actions">
          <button 
            className="btn-view-maps"
            onClick={() => {
                const coordinates = '12.932928085558668,77.69155615027897';
                window.open(`https://www.google.com/maps/place/${coordinates}/@${coordinates},18z`, '_blank');
              }}
          >
            View on Maps
          </button>
          <button 
            className="btn-assign-ambulance"
            onClick={() => setShowAmbulancePopup(true)}
            disabled={alert.status === 'assigned'}
          >
            {alert.status === 'assigned' ? 'Ambulance Assigned' : 'Assign Ambulance'}
          </button>
        </div>

        {/* Ambulance Popup */}
        {showAmbulancePopup && (
          <div className="ambulance-popup-overlay">
            <div className="ambulance-popup">
              <div className="popup-header">
                <h4>Assign Ambulance</h4>
                <button 
                  className="close-popup"
                  onClick={() => setShowAmbulancePopup(false)}
                >
                  &times;
                </button>
              </div>
              <div className="popup-content">
                <p>Select an available ambulance:</p>
                <div className="ambulance-options">
                  {ambulances
                    .filter(amb => amb.status === 'available')
                    .map(ambulance => (
                      <button
                        key={ambulance.id}
                        className="ambulance-option"
                        onClick={() => handleAssignClick(ambulance.id)}
                      >
                        <strong>{ambulance.id}</strong>
                        <span>ETA: {ambulance.eta}</span>
                        <span>Location: {ambulance.location}</span>
                      </button>
                    ))}
                  {ambulances.filter(amb => amb.status === 'available').length === 0 && (
                    <p className="no-ambulance">No ambulances available at the moment.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="alert-footer">
          <div className="alert-actions">
            {alert.status === 'unread' && (
              <button 
                className="btn-sm btn-outline"
                onClick={() => onMarkAsRead(alert.id)}
              >
                Mark as Read
              </button>
            )}
            <button 
              className="btn-sm btn-text"
              onClick={() => onDismiss(alert.id)}
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;

import React, { useState } from 'react';
import AmbulanceCard from '../components/AmbulanceCard';
import './Ambulance.css';

function Ambulance() {
  const emergencyNumber = '108'; // India's emergency number
  const [activeTab, setActiveTab] = useState('all');
  
  const handleEmergencyCall = () => {
    window.alert(`Calling emergency services at ${emergencyNumber}...`);
    // In a real app, this would initiate a phone call
  };

  const handleViewMap = (coordinates) => {
    // Using the @ param to drop a pin at the exact coordinates
   window.open(`https://www.google.com/maps/place/${coordinates}/@${coordinates},18z`, '_blank');
  };

  // Sample ambulance data - in a real app, this would come from an API
  const alerts = [
    { 
      id: 1, 
      patientId: 'P1001', 
      patientName: 'John Doe',
      type: 'Critical Care',
      eta: '5-10 min',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, Medical Center, Floor 3, Room 301',
      status: 'on-route',
      vehicleNumber: 'AMB-1001',
      coordinates: '12.932928085558668,77.69155615027897',
      message: 'Critical heart rate detected (180 BPM). Immediate medical attention required.'
    },
    { 
      id: 2, 
      patientId: 'P1003', 
      patientName: 'Sarah Smith',
      type: 'Basic Life Support',
      eta: '8-12 min',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Cardiology Wing, Room 205',
      status: 'available',
      vehicleNumber: 'AMB-1002',
      coordinates: '19.9329283423558668,77.69134227897',
      message: 'High blood pressure alert (180/110 mmHg). Monitor closely.'
    },
    { 
      id: 3, 
      patientId: 'P1005', 
      patientName: 'Mike Johnson',
      type: 'Emergency Response',
      eta: '3-7 min',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Rd, Orthopedics, Room 112',
      status: 'on-route',
      vehicleNumber: 'AMB-1003',
      coordinates: '15.9329283333558668,77.69111227897',
      message: 'Fall detected in room 312! Possible injury reported.'
    }
  ];

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === activeTab);

  return (
    <div className="ambulance-container">
      <div className="ambulance-header">
        <h1>Emergency Ambulance Services</h1>
        <p className="emergency-number">
          <span>Emergency: </span>
          <a href={`tel:${emergencyNumber}`} className="emergency-link">
            🚑 {emergencyNumber}
          </a>
        </p>
      </div>

      <div className="ambulance-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Services
        </button>
        <button 
          className={`tab-button ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
        >
          Emergency
        </button>
        <button 
          className={`tab-button ${activeTab === 'non-emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('non-emergency')}
        >
          Non-Emergency
        </button>
      </div>

      <div className="ambulance-grid">
        {filteredAlerts.map(alert => (
          <AmbulanceCard
            key={alert.id}
            name={alert.name}
            phone={alert.phone}
            eta={`ETA: ${alert.eta}`}
            address={alert.address}
              onViewMap={() => handleViewMap(alert.coordinates)}
          />
        ))}
      </div>

      <div className="emergency-call-container">
        <button 
          className="emergency-call-button"
          onClick={handleEmergencyCall}
          aria-label="Call Emergency Services"
        >
          🚨 Call Emergency ({emergencyNumber})
        </button>
      </div>
    </div>
  );
}

export default Ambulance;

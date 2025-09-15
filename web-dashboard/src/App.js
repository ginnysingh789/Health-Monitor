import React, { useState, useEffect } from 'react';
import './App.css';
import HealthDashboard from './components/HealthDashboard';
import AlertPanel from './components/AlertPanel';
import DataSimulator from './components/DataSimulator';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        // Generate simulated health data
        const newData = generateSimulatedData();
        setHealthData(newData);
        
        // Check for alerts
        const newAlerts = checkForAlerts(newData);
        if (newAlerts.length > 0) {
          setAlerts(prev => [...prev.slice(-4), ...newAlerts]);
        }
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const generateSimulatedData = () => {
    const baseHR = 72;
    const baseSPO2 = 98.5;
    const baseTemp = 98.6;
    
    // Add some realistic variation
    const heartRate = Math.max(50, Math.min(180, baseHR + Math.floor(Math.random() * 30 - 15)));
    const spo2 = Math.max(85, Math.min(100, baseSPO2 + (Math.random() * 4 - 2)));
    const temperature = Math.max(96, Math.min(104, baseTemp + (Math.random() * 2 - 1)));
    const fallDetected = Math.random() < 0.001; // Very rare
    
    return {
      timestamp: new Date().toISOString(),
      user_id: 'demo_user_001',
      heart_rate: heartRate,
      spo2: parseFloat(spo2.toFixed(1)),
      temperature: parseFloat(temperature.toFixed(1)),
      fall_detected: fallDetected,
      activity_level: ['resting', 'walking', 'active', 'sleeping'][Math.floor(Math.random() * 4)],
      battery_level: Math.max(0, 100 - Math.floor(Math.random() * 5))
    };
  };

  const checkForAlerts = (data) => {
    const alerts = [];
    const timestamp = new Date().toLocaleTimeString();

    if (data.heart_rate < 60) {
      alerts.push({
        id: Date.now() + Math.random(),
        type: 'warning',
        message: `Low heart rate: ${data.heart_rate} bpm`,
        timestamp
      });
    } else if (data.heart_rate > 100) {
      alerts.push({
        id: Date.now() + Math.random(),
        type: 'warning',
        message: `High heart rate: ${data.heart_rate} bpm`,
        timestamp
      });
    }

    if (data.spo2 < 95) {
      alerts.push({
        id: Date.now() + Math.random(),
        type: 'critical',
        message: `Low oxygen: ${data.spo2}%`,
        timestamp
      });
    }

    if (data.temperature > 100.4) {
      alerts.push({
        id: Date.now() + Math.random(),
        type: 'warning',
        message: `Fever detected: ${data.temperature}°F`,
        timestamp
      });
    }

    if (data.fall_detected) {
      alerts.push({
        id: Date.now() + Math.random(),
        type: 'emergency',
        message: 'Fall detected! Emergency services notified.',
        timestamp
      });
    }

    return alerts;
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setAlerts([{
      id: Date.now(),
      type: 'info',
      message: 'Health monitoring simulation started',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setAlerts(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: 'Health monitoring simulation stopped',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏥 Health Monitor Dashboard</h1>
        <p className="subtitle">Educational Project - Simulated Data Only</p>
      </header>

      <main className="app-main">
        <div className="control-panel">
          <DataSimulator 
            isSimulating={isSimulating}
            onStart={startSimulation}
            onStop={stopSimulation}
          />
        </div>

        <div className="dashboard-container">
          <HealthDashboard data={healthData} />
          <AlertPanel alerts={alerts} />
        </div>
      </main>

      <footer className="app-footer">
        <p>⚠️ Educational Use Only - Not for Medical Diagnosis</p>
      </footer>
    </div>
  );
}

export default App;

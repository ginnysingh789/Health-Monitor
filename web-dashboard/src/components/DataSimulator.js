import React from 'react';
import './DataSimulator.css';

const DataSimulator = ({ isSimulating, onStart, onStop }) => {
  return (
    <div className="card data-simulator">
      <h2>🔬 Data Simulation Control</h2>
      
      <div className="simulator-content">
        <div className="simulator-info">
          <p>
            <strong>Educational Simulation:</strong> This generates realistic health sensor data 
            to demonstrate the monitoring system without requiring actual hardware.
          </p>
          
          <div className="simulation-features">
            <div className="feature-item">
              <span className="feature-icon">❤️</span>
              <span>Heart Rate Monitoring</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🫁</span>
              <span>Blood Oxygen (SpO₂)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌡️</span>
              <span>Body Temperature</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚶</span>
              <span>Activity Detection</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚠️</span>
              <span>Anomaly Detection</span>
            </div>
          </div>
        </div>
        
        <div className="simulator-controls">
          <div className="status-indicator">
            <div className={`status-light ${isSimulating ? 'active' : 'inactive'}`}></div>
            <span className="status-text">
              {isSimulating ? 'Simulation Running' : 'Simulation Stopped'}
            </span>
          </div>
          
          <div className="control-buttons">
            {!isSimulating ? (
              <button 
                className="btn btn-primary"
                onClick={onStart}
              >
                ▶️ Start Simulation
              </button>
            ) : (
              <button 
                className="btn btn-danger"
                onClick={onStop}
              >
                ⏹️ Stop Simulation
              </button>
            )}
          </div>
          
          {isSimulating && (
            <div className="simulation-info-live">
              <p>📊 Generating new data every 3 seconds</p>
              <p>🔍 AI monitoring for health anomalies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSimulator;

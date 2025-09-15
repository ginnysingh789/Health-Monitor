# Health Monitor System - Educational Project

## Overview
This is an educational software project demonstrating a wearable health monitoring system concept. It uses **simulated data only** and is designed for academic learning purposes.

## Project Structure
```
HealthMonitor/
├── data-simulator/          # Python scripts for simulating sensor data
├── web-dashboard/           # React web application for monitoring
├── firebase-config/         # Firebase setup and configuration
├── ai-models/              # Basic AI algorithms for anomaly detection
└── docs/                   # Documentation and project reports
```

## Key Features (Simulated)
- Heart rate monitoring simulation
- SpO₂ level tracking simulation  
- Body temperature monitoring simulation
- Fall detection simulation
- Real-time data visualization
- Basic anomaly detection algorithms

## Technology Stack
- **Backend**: Python, Firebase
- **Frontend**: React, Chart.js
- **Database**: Firestore
- **AI/ML**: TensorFlow Lite, scikit-learn

## Important Notes
⚠️ **EDUCATIONAL USE ONLY**
- Uses simulated data only
- Not for medical diagnosis
- Academic project demonstration
- Compliant with company IT policies

## Getting Started

### Prerequisites
- Python 3.x installed
- Node.js installed
- Basic command line knowledge

### Step-by-Step Instructions

#### 1. Install Python Dependencies (Optional)
```bash
# Navigate to project root
cd HealthMonitor

# Install Python packages (only numpy needed for advanced features)
pip install numpy pandas
```

#### 2. Run the Health Data Simulator
```bash
# Navigate to data simulator folder
cd data-simulator

# Start the health data simulator
python health_data_simulator.py
```
This will start generating simulated health data every 5 seconds. You'll see:
- Heart rate, SpO₂, temperature readings
- Activity level and battery status
- Automatic anomaly detection alerts

#### 3. Test AI Anomaly Detection (Optional)
```bash
# In the data-simulator folder
python anomaly_detector.py
```
This demonstrates the AI system detecting health anomalies.

#### 4. Start the Web Dashboard
```bash
# Navigate to web dashboard folder
cd ../web-dashboard

# Install React dependencies (first time only)
npm install

# Start the web application
npm start
```
The dashboard will open at: **http://localhost:3000**

#### 5. Using the System
1. Open your browser to http://localhost:3000
2. Click "▶️ Start Simulation" to begin real-time monitoring
3. Watch the health metrics update every 3 seconds
4. Observe alerts when anomalies are detected
5. Click "⏹️ Stop Simulation" to pause

### What You'll See
- **Real-time Health Dashboard** with vital signs
- **Alert Panel** showing health warnings
- **Simulation Controls** to start/stop data generation
- **AI-powered anomaly detection** in action

## Project Phase 1 Goals
- [x] Project setup and structure
- [x] Data simulation system
- [x] Firebase integration (mock mode)
- [x] Basic web dashboard
- [x] Simple AI algorithms

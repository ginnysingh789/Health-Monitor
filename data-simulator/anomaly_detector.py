"""
Basic AI Anomaly Detection for Health Monitoring
Educational implementation using simple statistical methods
"""

import numpy as np
from typing import Dict, List, Tuple
import json
from datetime import datetime, timedelta

class HealthAnomalyDetector:
    """Simple anomaly detection for health monitoring data"""
    
    def __init__(self):
        self.normal_ranges = {
            'heart_rate': (60, 100),
            'spo2': (95, 100),
            'temperature': (97.0, 99.5)  # Fahrenheit
        }
        
        self.history = []
        self.max_history = 100  # Keep last 100 readings
        
    def add_reading(self, reading: Dict):
        """Add new reading to history"""
        self.history.append(reading)
        if len(self.history) > self.max_history:
            self.history.pop(0)
    
    def detect_range_anomalies(self, reading: Dict) -> List[Dict]:
        """Detect values outside normal ranges"""
        anomalies = []
        
        # Heart rate check
        hr = reading.get('heart_rate', 0)
        if hr < self.normal_ranges['heart_rate'][0]:
            anomalies.append({
                'type': 'bradycardia',
                'severity': 'high' if hr < 50 else 'medium',
                'value': hr,
                'message': f'Low heart rate detected: {hr} bpm'
            })
        elif hr > self.normal_ranges['heart_rate'][1]:
            anomalies.append({
                'type': 'tachycardia',
                'severity': 'high' if hr > 120 else 'medium',
                'value': hr,
                'message': f'High heart rate detected: {hr} bpm'
            })
        
        # SpO2 check
        spo2 = reading.get('spo2', 100)
        if spo2 < self.normal_ranges['spo2'][0]:
            severity = 'critical' if spo2 < 90 else 'high'
            anomalies.append({
                'type': 'hypoxemia',
                'severity': severity,
                'value': spo2,
                'message': f'Low oxygen saturation: {spo2}%'
            })
        
        # Temperature check
        temp = reading.get('temperature', 98.6)
        if temp > self.normal_ranges['temperature'][1]:
            severity = 'high' if temp > 101 else 'medium'
            anomalies.append({
                'type': 'fever',
                'severity': severity,
                'value': temp,
                'message': f'Elevated temperature: {temp}°F'
            })
        elif temp < self.normal_ranges['temperature'][0]:
            anomalies.append({
                'type': 'hypothermia',
                'severity': 'medium',
                'value': temp,
                'message': f'Low temperature: {temp}°F'
            })
        
        # Fall detection
        if reading.get('fall_detected', False):
            anomalies.append({
                'type': 'fall',
                'severity': 'critical',
                'value': True,
                'message': 'Fall detected - immediate attention required'
            })
        
        return anomalies
    
    def detect_trend_anomalies(self, reading: Dict) -> List[Dict]:
        """Detect anomalies based on trends in historical data"""
        if len(self.history) < 10:
            return []  # Need at least 10 readings for trend analysis
        
        anomalies = []
        
        # Get recent heart rate values
        recent_hr = [r.get('heart_rate', 72) for r in self.history[-10:]]
        current_hr = reading.get('heart_rate', 72)
        
        # Calculate moving average and standard deviation
        hr_mean = np.mean(recent_hr)
        hr_std = np.std(recent_hr)
        
        # Z-score anomaly detection (threshold: 2.5 standard deviations)
        if hr_std > 0:
            z_score = abs(current_hr - hr_mean) / hr_std
            if z_score > 2.5:
                anomalies.append({
                    'type': 'heart_rate_trend',
                    'severity': 'medium',
                    'value': current_hr,
                    'z_score': round(z_score, 2),
                    'message': f'Heart rate trend anomaly: {current_hr} bpm (Z-score: {z_score:.2f})'
                })
        
        # Similar analysis for SpO2
        recent_spo2 = [r.get('spo2', 98.5) for r in self.history[-10:]]
        current_spo2 = reading.get('spo2', 98.5)
        
        spo2_mean = np.mean(recent_spo2)
        spo2_std = np.std(recent_spo2)
        
        if spo2_std > 0:
            z_score = abs(current_spo2 - spo2_mean) / spo2_std
            if z_score > 2.0:  # Lower threshold for SpO2
                anomalies.append({
                    'type': 'spo2_trend',
                    'severity': 'medium',
                    'value': current_spo2,
                    'z_score': round(z_score, 2),
                    'message': f'SpO2 trend anomaly: {current_spo2}% (Z-score: {z_score:.2f})'
                })
        
        return anomalies
    
    def analyze_reading(self, reading: Dict) -> Dict:
        """Complete analysis of a health reading"""
        # Add to history
        self.add_reading(reading)
        
        # Detect all types of anomalies
        range_anomalies = self.detect_range_anomalies(reading)
        trend_anomalies = self.detect_trend_anomalies(reading)
        
        all_anomalies = range_anomalies + trend_anomalies
        
        # Determine overall health status
        if not all_anomalies:
            status = "normal"
            risk_level = "low"
        elif any(a['severity'] == 'critical' for a in all_anomalies):
            status = "critical"
            risk_level = "critical"
        elif any(a['severity'] == 'high' for a in all_anomalies):
            status = "warning"
            risk_level = "high"
        else:
            status = "caution"
            risk_level = "medium"
        
        return {
            'timestamp': reading.get('timestamp', datetime.now().isoformat()),
            'user_id': reading.get('user_id', 'unknown'),
            'status': status,
            'risk_level': risk_level,
            'anomalies': all_anomalies,
            'anomaly_count': len(all_anomalies),
            'recommendations': self.generate_recommendations(all_anomalies)
        }
    
    def generate_recommendations(self, anomalies: List[Dict]) -> List[str]:
        """Generate recommendations based on detected anomalies"""
        recommendations = []
        
        for anomaly in anomalies:
            if anomaly['type'] == 'fall':
                recommendations.append("🚨 Call emergency services immediately")
                recommendations.append("📞 Contact emergency contact")
            
            elif anomaly['type'] == 'hypoxemia':
                if anomaly['severity'] == 'critical':
                    recommendations.append("🏥 Seek immediate medical attention")
                else:
                    recommendations.append("💨 Check breathing, consider medical consultation")
            
            elif anomaly['type'] in ['bradycardia', 'tachycardia']:
                if anomaly['severity'] == 'high':
                    recommendations.append("❤️ Monitor heart rate closely, consider medical consultation")
                else:
                    recommendations.append("🧘 Rest and monitor, avoid strenuous activity")
            
            elif anomaly['type'] == 'fever':
                recommendations.append("🌡️ Monitor temperature, stay hydrated, rest")
                if anomaly['severity'] == 'high':
                    recommendations.append("💊 Consider fever reducer, consult healthcare provider")
        
        # Remove duplicates
        return list(set(recommendations))

def test_anomaly_detector():
    """Test the anomaly detector with sample data"""
    detector = HealthAnomalyDetector()
    
    # Test cases
    test_readings = [
        {
            'timestamp': datetime.now().isoformat(),
            'user_id': 'test_user',
            'heart_rate': 75,
            'spo2': 98.0,
            'temperature': 98.6,
            'fall_detected': False
        },
        {
            'timestamp': datetime.now().isoformat(),
            'user_id': 'test_user',
            'heart_rate': 45,  # Low HR
            'spo2': 92.0,      # Low SpO2
            'temperature': 101.5, # Fever
            'fall_detected': False
        },
        {
            'timestamp': datetime.now().isoformat(),
            'user_id': 'test_user',
            'heart_rate': 85,
            'spo2': 97.0,
            'temperature': 98.8,
            'fall_detected': True  # Fall detected
        }
    ]
    
    print("🧠 Testing AI Anomaly Detection System\n")
    
    for i, reading in enumerate(test_readings, 1):
        print(f"Test Case {i}:")
        analysis = detector.analyze_reading(reading)
        
        print(f"Status: {analysis['status'].upper()}")
        print(f"Risk Level: {analysis['risk_level'].upper()}")
        print(f"Anomalies Found: {analysis['anomaly_count']}")
        
        for anomaly in analysis['anomalies']:
            print(f"  - {anomaly['message']} (Severity: {anomaly['severity']})")
        
        if analysis['recommendations']:
            print("Recommendations:")
            for rec in analysis['recommendations']:
                print(f"  {rec}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_anomaly_detector()

"""
Health Monitor Data Simulator
Educational project - generates realistic simulated sensor data
"""

import random
import time
import json
import datetime
from dataclasses import dataclass
from typing import Dict, List
import numpy as np

@dataclass
class HealthData:
    """Data structure for health monitoring readings"""
    timestamp: str
    user_id: str
    heart_rate: int
    spo2: float
    temperature: float
    fall_detected: bool
    activity_level: str
    location: Dict[str, float]
    battery_level: int

class WearableSimulator:
    """Simulates a wearable health monitoring device"""
    
    def __init__(self, user_id: str = "user_001"):
        self.user_id = user_id
        self.base_hr = 72  # Base heart rate
        self.base_spo2 = 98.5  # Base SpO2
        self.base_temp = 98.6  # Base temperature (Fahrenheit)
        self.battery_level = 100
        self.activity_states = ["resting", "walking", "active", "sleeping"]
        self.current_activity = "resting"
        
    def generate_heart_rate(self) -> int:
        """Generate realistic heart rate based on activity"""
        activity_modifiers = {
            "sleeping": -15,
            "resting": 0,
            "walking": 20,
            "active": 40
        }
        
        base = self.base_hr + activity_modifiers.get(self.current_activity, 0)
        # Add some random variation
        variation = random.randint(-5, 8)
        hr = max(50, min(180, base + variation))
        
        # Simulate occasional anomalies (5% chance)
        if random.random() < 0.05:
            if random.random() < 0.5:
                hr = random.randint(45, 55)  # Low HR
            else:
                hr = random.randint(100, 120)  # High HR
                
        return hr
    
    def generate_spo2(self) -> float:
        """Generate SpO2 levels"""
        base = self.base_spo2
        variation = random.uniform(-1.5, 1.0)
        spo2 = max(85.0, min(100.0, base + variation))
        
        # Simulate occasional low oxygen (3% chance)
        if random.random() < 0.03:
            spo2 = random.uniform(88.0, 94.0)
            
        return round(spo2, 1)
    
    def generate_temperature(self) -> float:
        """Generate body temperature"""
        base = self.base_temp
        variation = random.uniform(-0.8, 1.2)
        temp = base + variation
        
        # Simulate fever (2% chance)
        if random.random() < 0.02:
            temp = random.uniform(100.4, 102.5)
            
        return round(temp, 1)
    
    def detect_fall(self) -> bool:
        """Simulate fall detection (very rare event)"""
        # 0.1% chance of fall detection
        return random.random() < 0.001
    
    def update_activity(self):
        """Randomly change activity state"""
        if random.random() < 0.1:  # 10% chance to change activity
            self.current_activity = random.choice(self.activity_states)
    
    def simulate_location(self) -> Dict[str, float]:
        """Generate GPS coordinates (simulated home area)"""
        # Simulate location around a home base with small variations
        base_lat = 28.6139  # Delhi coordinates (example)
        base_lng = 77.2090
        
        lat_variation = random.uniform(-0.001, 0.001)
        lng_variation = random.uniform(-0.001, 0.001)
        
        return {
            "latitude": round(base_lat + lat_variation, 6),
            "longitude": round(base_lng + lng_variation, 6)
        }
    
    def update_battery(self):
        """Simulate battery drain"""
        if random.random() < 0.01:  # 1% chance to decrease battery
            self.battery_level = max(0, self.battery_level - 1)
    
    def generate_reading(self) -> HealthData:
        """Generate a complete health data reading"""
        self.update_activity()
        self.update_battery()
        
        return HealthData(
            timestamp=datetime.datetime.now().isoformat(),
            user_id=self.user_id,
            heart_rate=self.generate_heart_rate(),
            spo2=self.generate_spo2(),
            temperature=self.generate_temperature(),
            fall_detected=self.detect_fall(),
            activity_level=self.current_activity,
            location=self.simulate_location(),
            battery_level=self.battery_level
        )
    
    def to_dict(self, data: HealthData) -> Dict:
        """Convert HealthData to dictionary"""
        return {
            "timestamp": data.timestamp,
            "user_id": data.user_id,
            "heart_rate": data.heart_rate,
            "spo2": data.spo2,
            "temperature": data.temperature,
            "fall_detected": data.fall_detected,
            "activity_level": data.activity_level,
            "location": data.location,
            "battery_level": data.battery_level
        }

def main():
    """Main simulation loop"""
    print("🏥 Health Monitor Data Simulator Started")
    print("📊 Generating simulated wearable sensor data...")
    print("⚠️  Educational use only - simulated data\n")
    
    simulator = WearableSimulator("demo_user_001")
    
    try:
        while True:
            # Generate new reading
            reading = simulator.generate_reading()
            data_dict = simulator.to_dict(reading)
            
            # Display current reading
            print(f"⏰ {reading.timestamp}")
            print(f"❤️  Heart Rate: {reading.heart_rate} bpm")
            print(f"🫁 SpO₂: {reading.spo2}%")
            print(f"🌡️  Temperature: {reading.temperature}°F")
            print(f"🚶 Activity: {reading.activity_level}")
            print(f"🔋 Battery: {reading.battery_level}%")
            
            if reading.fall_detected:
                print("🚨 FALL DETECTED! Emergency alert triggered!")
            
            # Check for anomalies
            if reading.heart_rate < 60 or reading.heart_rate > 100:
                print(f"⚠️  Heart rate anomaly detected: {reading.heart_rate} bpm")
            
            if reading.spo2 < 95:
                print(f"⚠️  Low oxygen detected: {reading.spo2}%")
                
            if reading.temperature > 100.4:
                print(f"⚠️  Fever detected: {reading.temperature}°F")
            
            print("-" * 50)
            
            # Save to JSON file for testing
            with open('latest_reading.json', 'w') as f:
                json.dump(data_dict, f, indent=2)
            
            # Wait 5 seconds before next reading
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n🛑 Simulation stopped by user")
        print("📁 Latest reading saved to 'latest_reading.json'")

if __name__ == "__main__":
    main()

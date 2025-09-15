"""
Firebase Configuration for Health Monitor
Educational project - sets up Firestore database connection
"""

import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from datetime import datetime
from typing import Dict, Optional

class FirebaseHealthDB:
    """Firebase Firestore database manager for health data"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.db = None
        self.app = None
        self.config_path = config_path or "firebase-config.json"
        
    def initialize_firebase(self) -> bool:
        """Initialize Firebase connection"""
        try:
            # For educational purposes, we'll create a mock configuration
            if not os.path.exists(self.config_path):
                self.create_mock_config()
            
            # In a real project, you would use actual Firebase credentials
            # cred = credentials.Certificate(self.config_path)
            # self.app = firebase_admin.initialize_app(cred)
            # self.db = firestore.client()
            
            print("🔥 Firebase initialized (Mock mode for educational purposes)")
            print("📝 To use real Firebase:")
            print("   1. Create a Firebase project at https://console.firebase.google.com")
            print("   2. Generate service account key")
            print("   3. Replace firebase-config.json with your credentials")
            print("   4. Uncomment the real Firebase initialization code")
            
            return True
            
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            return False
    
    def create_mock_config(self):
        """Create mock Firebase configuration for educational purposes"""
        mock_config = {
            "type": "service_account",
            "project_id": "health-monitor-demo",
            "private_key_id": "mock_key_id",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk@health-monitor-demo.iam.gserviceaccount.com",
            "client_id": "mock_client_id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
        }
        
        with open(self.config_path, 'w') as f:
            json.dump(mock_config, f, indent=2)
        
        print(f"📄 Mock Firebase config created: {self.config_path}")
    
    def save_health_data(self, data: Dict) -> bool:
        """Save health data to Firestore (mock implementation)"""
        try:
            # Mock implementation - in real project, this would save to Firestore
            # doc_ref = self.db.collection('health_readings').add(data)
            
            # For now, save to local JSON file for demonstration
            filename = f"health_data_{datetime.now().strftime('%Y%m%d')}.json"
            
            # Load existing data
            existing_data = []
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    existing_data = json.load(f)
            
            # Add new data
            existing_data.append(data)
            
            # Save back to file
            with open(filename, 'w') as f:
                json.dump(existing_data, f, indent=2)
            
            print(f"💾 Health data saved to {filename}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to save health data: {e}")
            return False
    
    def get_recent_data(self, user_id: str, limit: int = 10) -> list:
        """Get recent health data for a user (mock implementation)"""
        try:
            # Mock implementation - in real project, this would query Firestore
            filename = f"health_data_{datetime.now().strftime('%Y%m%d')}.json"
            
            if not os.path.exists(filename):
                return []
            
            with open(filename, 'r') as f:
                all_data = json.load(f)
            
            # Filter by user_id and get recent entries
            user_data = [d for d in all_data if d.get('user_id') == user_id]
            return user_data[-limit:] if user_data else []
            
        except Exception as e:
            print(f"❌ Failed to retrieve health data: {e}")
            return []
    
    def setup_database_structure(self):
        """Set up Firestore collections and indexes (mock implementation)"""
        collections = {
            'health_readings': {
                'description': 'Real-time health sensor data',
                'fields': ['timestamp', 'user_id', 'heart_rate', 'spo2', 'temperature', 'fall_detected']
            },
            'users': {
                'description': 'User profiles and settings',
                'fields': ['user_id', 'name', 'age', 'emergency_contacts', 'medical_conditions']
            },
            'alerts': {
                'description': 'Health alerts and notifications',
                'fields': ['timestamp', 'user_id', 'alert_type', 'severity', 'message', 'resolved']
            },
            'hospitals': {
                'description': 'Nearby hospitals and medical facilities',
                'fields': ['name', 'address', 'coordinates', 'phone', 'services']
            }
        }
        
        print("🏗️  Database Structure Plan:")
        for collection, info in collections.items():
            print(f"📁 Collection: {collection}")
            print(f"   Description: {info['description']}")
            print(f"   Fields: {', '.join(info['fields'])}")
            print()
        
        # Create sample data structure file
        with open('database_structure.json', 'w') as f:
            json.dump(collections, f, indent=2)
        
        print("📄 Database structure saved to database_structure.json")

def main():
    """Test Firebase setup"""
    print("🔥 Firebase Health Monitor Setup")
    print("=" * 50)
    
    # Initialize Firebase
    firebase_db = FirebaseHealthDB()
    
    if firebase_db.initialize_firebase():
        print("✅ Firebase setup completed")
        
        # Setup database structure
        firebase_db.setup_database_structure()
        
        # Test data save
        sample_data = {
            'timestamp': datetime.now().isoformat(),
            'user_id': 'demo_user_001',
            'heart_rate': 75,
            'spo2': 98.5,
            'temperature': 98.6,
            'fall_detected': False,
            'activity_level': 'resting',
            'location': {'latitude': 28.6139, 'longitude': 77.2090},
            'battery_level': 85
        }
        
        if firebase_db.save_health_data(sample_data):
            print("✅ Sample data saved successfully")
        
        # Test data retrieval
        recent_data = firebase_db.get_recent_data('demo_user_001', 5)
        print(f"📊 Retrieved {len(recent_data)} recent readings")
        
    else:
        print("❌ Firebase setup failed")

if __name__ == "__main__":
    main()

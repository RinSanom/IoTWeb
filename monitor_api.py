#!/usr/bin/env python3
"""
Production monitoring script for AQI API
Checks server health and performance
"""

import requests
import time
import json
from datetime import datetime

def check_api_health():
    """Check if API is responding"""
    try:
        response = requests.get('http://localhost:5000/', timeout=5)
        if response.status_code == 200:
            return True, response.json()
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def check_prediction_endpoint():
    """Test the prediction endpoint"""
    try:
        test_data = {
            "pm25": 25.5,
            "temperature": 30,
            "humidity": 65
        }
        response = requests.post('http://localhost:5000/api/predict', 
                               json=test_data, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return True, data['data']['predicted_aqi']
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def monitor_api():
    """Monitor API continuously"""
    print("🔍 AQI API Production Monitor")
    print("=" * 40)
    
    while True:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Check main endpoint
        health_ok, health_result = check_api_health()
        health_status = "✅ UP" if health_ok else "❌ DOWN"
        
        # Check prediction endpoint
        predict_ok, predict_result = check_prediction_endpoint()
        predict_status = "✅ OK" if predict_ok else "❌ FAIL"
        
        print(f"\n[{timestamp}]")
        print(f"API Health: {health_status}")
        print(f"Prediction: {predict_status}")
        
        if health_ok:
            print(f"Model Accuracy: {health_result.get('model_accuracy', 'N/A')}")
        
        if predict_ok:
            print(f"Test Prediction: {predict_result:.1f} AQI")
        
        if not health_ok or not predict_ok:
            print("⚠️  Issues detected!")
            if not health_ok:
                print(f"   Health check failed: {health_result}")
            if not predict_ok:
                print(f"   Prediction failed: {predict_result}")
        
        time.sleep(30)  # Check every 30 seconds

if __name__ == "__main__":
    try:
        monitor_api()
    except KeyboardInterrupt:
        print("\n👋 Monitoring stopped")

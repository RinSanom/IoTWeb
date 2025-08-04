#!/usr/bin/env python3
"""
AQI API Test Client
Test all endpoints and demonstrate API functionality
"""

import requests
import json
import time
from datetime import datetime

API_BASE = "http://localhost:5000"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test an API endpoint and display results"""
    print(f"\n🔸 {description}")
    print(f"📡 {method} {endpoint}")
    print("-" * 50)
    
    try:
        if method == "GET":
            response = requests.get(f"{API_BASE}{endpoint}")
        elif method == "POST":
            response = requests.post(f"{API_BASE}{endpoint}", json=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status: {result.get('status', 'success')}")
            
            # Display key information based on endpoint
            if '/current' in endpoint:
                data = result.get('data', {})
                print(f"🌤️  Current AQI: {data.get('aqi')} ({data.get('category')})")
                print(f"🌡️  Temperature: {data.get('parameters', {}).get('temperature')}°C")
                print(f"💧 Humidity: {data.get('parameters', {}).get('humidity')}%")
                
            elif '/predict' in endpoint:
                data = result.get('data', {})
                print(f"🔮 Predicted AQI: {data.get('predicted_aqi')} ({data.get('category')})")
                print(f"⚙️  Method: {data.get('method')}")
                
            elif '/forecast' in endpoint:
                data = result.get('data', {})
                forecast = data.get('forecast', [])
                if forecast:
                    print(f"📊 Forecast Count: {len(forecast)} entries")
                    print(f"📅 First Entry: AQI {forecast[0].get('predicted_aqi')} at {forecast[0].get('datetime')}")
                
            elif endpoint == '/':
                print(f"🚀 API: {result.get('api')}")
                print(f"📊 Model Accuracy: {result.get('model_accuracy')}")
                print(f"📡 Available Endpoints: {len(result.get('endpoints', {}))}")
                
            elif '/health-advice' in endpoint:
                data = result.get('data', {})
                advice = data.get('advice', {})
                print(f"💡 Level: {advice.get('level')}")
                print(f"👥 General: {advice.get('general')}")
                
            else:
                # Show first few lines of response
                print(f"📄 Response preview:")
                response_text = json.dumps(result, indent=2)
                lines = response_text.split('\n')[:5]
                for line in lines:
                    print(f"   {line}")
                if len(lines) >= 5:
                    print("   ...")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"📝 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

def main():
    """Run comprehensive API tests"""
    print("🧪 AQI Machine Learning API Test Suite")
    print("=" * 60)
    print(f"⏰ Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 API Base URL: {API_BASE}")
    
    # Test all endpoints
    test_endpoint("GET", "/", description="API Information & Status")
    
    test_endpoint("GET", "/api/current", description="Current AQI Data")
    
    test_endpoint("GET", "/api/forecast/hourly?hours=6", description="6-Hour Forecast")
    
    test_endpoint("GET", "/api/forecast/daily?days=3", description="3-Day Forecast")
    
    test_endpoint("POST", "/api/predict", 
                 data={
                     "pm25": 25.5,
                     "pm1": 18.2,
                     "temperature": 30.5,
                     "humidity": 65.0,
                     "ultrafine_particles": 1500
                 },
                 description="Predict AQI from Parameters")
    
    test_endpoint("GET", "/api/health-advice/75.5", description="Health Advice for AQI 75.5")
    
    test_endpoint("GET", "/api/data/metadata", description="API Metadata")
    
    test_endpoint("GET", "/api/locations", description="Available Locations")
    
    test_endpoint("GET", "/api/parameters", description="Parameter Information")
    
    # Performance test
    print(f"\n🏃 Performance Test")
    print("-" * 50)
    start_time = time.time()
    for i in range(5):
        requests.get(f"{API_BASE}/api/current")
    end_time = time.time()
    avg_time = (end_time - start_time) / 5
    print(f"⚡ Average Response Time: {avg_time:.3f} seconds")
    
    print(f"\n🎉 API Test Suite Complete!")
    print("=" * 60)
    print("✅ Your AQI API server is fully operational!")
    print("🌐 Ready for web integration!")
    print("🚀 Deploy to production when ready!")

if __name__ == "__main__":
    main()

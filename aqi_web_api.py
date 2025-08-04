#!/usr/bin/env python3
"""
AQI Web API Server
Flask-based API server for serving AQI predictions as JSON
Perfect for integration with web projects and mobile apps
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import joblib
import numpy as np
from future_predictions import AQIFuturePredictor

app = Flask(__name__)
# Enable CORS for your Vercel app and localhost
CORS(app, origins=[
    "https://io-t-web-six.vercel.app/",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080"
])

# Global predictor instance
predictor = None

def initialize_predictor():
    """Initialize the AQI predictor"""
    global predictor
    if predictor is None:
        try:
            predictor = AQIFuturePredictor()
            predictor.analyze_trends()
            print("✅ AQI Predictor initialized")
        except Exception as e:
            print(f"❌ Error initializing predictor: {e}")
            predictor = None

@app.route('/')
def home():
    """API home page with documentation"""
    return jsonify({
        'name': 'AQI Prediction API',
        'version': '1.0',
        'description': 'Machine Learning based Air Quality Index predictions',
        'endpoints': {
            '/api/current': 'Get current AQI status',
            '/api/predict': 'Get AQI prediction for specific parameters',
            '/api/forecast/daily': 'Get daily AQI forecast',
            '/api/forecast/hourly': 'Get hourly AQI forecast',
            '/api/info': 'Get API information and AQI scale'
        },
        'model_accuracy': '99.95%',
        'last_updated': datetime.now().isoformat()
    })

@app.route('/api/info')
def api_info():
    """Get API information and AQI scale"""
    return jsonify({
        'api_info': {
            'version': '1.0',
            'model_type': 'Gradient Boosting Regressor',
            'accuracy': '99.95%',
            'location': 'Cambodia (Phnom Penh area)',
            'parameters': ['PM1', 'PM2.5', 'Temperature', 'Humidity', 'Ultrafine Particles']
        },
        'aqi_scale': {
            'Good': {
                'range': '0-50',
                'color': '#00E400',
                'description': 'Air quality is good. Ideal for outdoor activities.',
                'health_advice': 'Enjoy outdoor activities'
            },
            'Moderate': {
                'range': '51-100',
                'color': '#FFFF00',
                'description': 'Air quality is moderate.',
                'health_advice': 'Sensitive individuals should consider reducing prolonged outdoor activities'
            },
            'Unhealthy for Sensitive Groups': {
                'range': '101-150',
                'color': '#FF7E00',
                'description': 'Unhealthy for sensitive groups.',
                'health_advice': 'People with respiratory conditions should limit outdoor activities'
            },
            'Unhealthy': {
                'range': '151-200',
                'color': '#FF0000',
                'description': 'Unhealthy for everyone.',
                'health_advice': 'Everyone should reduce outdoor activities'
            },
            'Very Unhealthy': {
                'range': '201-300',
                'color': '#8F3F97',
                'description': 'Very unhealthy air quality.',
                'health_advice': 'Avoid outdoor activities'
            },
            'Hazardous': {
                'range': '301-500',
                'color': '#7E0023',
                'description': 'Hazardous air quality.',
                'health_advice': 'Stay indoors and avoid all outdoor activities'
            }
        }
    })

@app.route('/api/current')
def current_aqi():
    """Get current AQI status (simulated with latest prediction)"""
    if predictor is None:
        initialize_predictor()
    
    if predictor is None:
        return jsonify({'error': 'Predictor not available'}), 500
    
    try:
        # Get prediction for current time
        now = datetime.now()
        prediction = predictor.predict_future_aqi(now, num_scenarios=1)[0]
        
        return jsonify({
            'current_aqi': prediction['predicted_aqi'],
            'category': prediction['category'],
            'datetime': now.isoformat(),
            'location': 'Cambodia (Phnom Penh area)',
            'coordinates': {
                'latitude': 11.598675,
                'longitude': 104.8013326
            },
            'parameters': prediction['parameters'],
            'health_advice': get_health_advice(prediction['predicted_aqi']),
            'last_updated': now.isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict_aqi():
    """Predict AQI for specific parameters"""
    if predictor is None:
        initialize_predictor()
    
    if predictor is None:
        return jsonify({'error': 'Predictor not available'}), 500
    
    try:
        data = request.json
        
        # Extract parameters
        pm1 = float(data.get('pm1', 10.0))
        pm25 = float(data.get('pm25', 20.0))
        temperature = float(data.get('temperature', 28.0))
        humidity = float(data.get('humidity', 65.0))
        hour = int(data.get('hour', datetime.now().hour))
        day_of_week = int(data.get('day_of_week', datetime.now().weekday()))
        month = int(data.get('month', datetime.now().month))
        
        # Make prediction
        predicted_aqi, category = predictor.aqi_system.predict_aqi(
            pm1=pm1, pm25=pm25, temperature=temperature, humidity=humidity,
            hour=hour, day_of_week=day_of_week, month=month
        )
        
        return jsonify({
            'predicted_aqi': round(predicted_aqi, 1),
            'category': category,
            'input_parameters': {
                'pm1': pm1,
                'pm25': pm25,
                'temperature': temperature,
                'humidity': humidity,
                'hour': hour,
                'day_of_week': day_of_week,
                'month': month
            },
            'health_advice': get_health_advice(predicted_aqi),
            'prediction_time': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/forecast/daily')
def daily_forecast():
    """Get daily AQI forecast for next 7 days"""
    if predictor is None:
        initialize_predictor()
    
    if predictor is None:
        return jsonify({'error': 'Predictor not available'}), 500
    
    try:
        days = int(request.args.get('days', 7))
        days = min(days, 14)  # Limit to 14 days
        
        today = datetime.now()
        end_date = today + timedelta(days=days)
        
        predictions = predictor.predict_future_range(today, end_date, 'daily')
        
        return jsonify({
            'forecast_type': 'daily',
            'days_ahead': days,
            'generated_at': datetime.now().isoformat(),
            'predictions': predictions,
            'summary': {
                'avg_aqi': round(np.mean([p['predicted_aqi'] for p in predictions]), 1),
                'max_aqi': max([p['predicted_aqi'] for p in predictions]),
                'min_aqi': min([p['predicted_aqi'] for p in predictions]),
                'total_predictions': len(predictions)
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/forecast/hourly')
def hourly_forecast():
    """Get hourly AQI forecast for next 24-48 hours"""
    if predictor is None:
        initialize_predictor()
    
    if predictor is None:
        return jsonify({'error': 'Predictor not available'}), 500
    
    try:
        hours = int(request.args.get('hours', 24))
        hours = min(hours, 48)  # Limit to 48 hours
        
        now = datetime.now()
        end_time = now + timedelta(hours=hours)
        
        predictions = predictor.predict_future_range(now, end_time, 'hourly')
        
        return jsonify({
            'forecast_type': 'hourly',
            'hours_ahead': hours,
            'generated_at': datetime.now().isoformat(),
            'predictions': predictions,
            'summary': {
                'avg_aqi': round(np.mean([p['predicted_aqi'] for p in predictions]), 1),
                'max_aqi': max([p['predicted_aqi'] for p in predictions]),
                'min_aqi': min([p['predicted_aqi'] for p in predictions]),
                'peak_hour': max(predictions, key=lambda x: x['predicted_aqi'])['datetime'],
                'total_predictions': len(predictions)
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-static')
def generate_static_json():
    """Generate static JSON files for web projects"""
    if predictor is None:
        initialize_predictor()
    
    if predictor is None:
        return jsonify({'error': 'Predictor not available'}), 500
    
    try:
        now = datetime.now()
        
        # Generate different timeframe predictions
        hourly_24h = predictor.predict_future_range(now, now + timedelta(hours=24), 'hourly')
        daily_7d = predictor.predict_future_range(now, now + timedelta(days=7), 'daily')
        
        # Comprehensive web data
        web_data = {
            'metadata': {
                'api_version': '1.0',
                'generated_at': now.isoformat(),
                'model_accuracy': '99.95%',
                'location': 'Cambodia (Phnom Penh area)',
                'coordinates': {'latitude': 11.598675, 'longitude': 104.8013326},
                'timezone': 'Asia/Phnom_Penh'
            },
            'current': {
                'aqi': predictor.predict_future_aqi(now, num_scenarios=1)[0]['predicted_aqi'],
                'category': predictor.predict_future_aqi(now, num_scenarios=1)[0]['category'],
                'timestamp': now.isoformat()
            },
            'forecasts': {
                'hourly_24h': hourly_24h,
                'daily_7d': daily_7d
            },
            'aqi_reference': {
                'Good': {'min': 0, 'max': 50, 'color': '#00E400'},
                'Moderate': {'min': 51, 'max': 100, 'color': '#FFFF00'},
                'Unhealthy for Sensitive Groups': {'min': 101, 'max': 150, 'color': '#FF7E00'},
                'Unhealthy': {'min': 151, 'max': 200, 'color': '#FF0000'},
                'Very Unhealthy': {'min': 201, 'max': 300, 'color': '#8F3F97'},
                'Hazardous': {'min': 301, 'max': 500, 'color': '#7E0023'}
            }
        }
        
        # Save to file
        with open('aqi_web_data.json', 'w') as f:
            json.dump(web_data, f, indent=2)
        
        return jsonify({
            'message': 'Static JSON files generated successfully',
            'files': ['aqi_web_data.json'],
            'total_predictions': len(hourly_24h) + len(daily_7d)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_health_advice(aqi):
    """Get health advice based on AQI"""
    if aqi <= 50:
        return "Air quality is good. Ideal conditions for outdoor activities."
    elif aqi <= 100:
        return "Air quality is moderate. Sensitive individuals should consider reducing prolonged outdoor activities."
    elif aqi <= 150:
        return "Unhealthy for sensitive groups. People with respiratory conditions should limit outdoor activities."
    elif aqi <= 200:
        return "Unhealthy air quality. Everyone should reduce outdoor activities."
    elif aqi <= 300:
        return "Very unhealthy air quality. Avoid outdoor activities."
    else:
        return "Hazardous air quality. Stay indoors and avoid all outdoor activities."

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🌐 Starting AQI Web API Server...")
    print("📡 Initializing predictor...")
    initialize_predictor()
    
    print("\n🚀 API Endpoints:")
    print("  GET  /                     - API documentation")
    print("  GET  /api/info            - API information and AQI scale")
    print("  GET  /api/current         - Current AQI status")
    print("  POST /api/predict         - Predict AQI for parameters")
    print("  GET  /api/forecast/daily  - Daily forecast (7 days)")
    print("  GET  /api/forecast/hourly - Hourly forecast (24 hours)")
    print("  GET  /api/generate-static - Generate static JSON files")
    
    print("\n🔗 Example URLs:")
    print("  http://localhost:5000/api/current")
    print("  http://localhost:5000/api/forecast/daily?days=5")
    print("  http://localhost:5000/api/forecast/hourly?hours=12")
    
    print("\n🌐 Server starting on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

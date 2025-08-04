#!/usr/bin/env python3
"""
Quick AQI Prediction Script
Standalone script for making AQI predictions with a trained model
"""

import joblib
import numpy as np

def load_model(model_path='aqi_model.joblib'):
    """Load the trained AQI model"""
    try:
        model_data = joblib.load(model_path)
        return model_data
    except FileNotFoundError:
        print(f"❌ Model file '{model_path}' not found. Please run the training first.")
        return None

def get_aqi_category(aqi):
    """Get AQI category and color code"""
    if aqi <= 50:
        return "Good", "🟢"
    elif aqi <= 100:
        return "Moderate", "🟡"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups", "🟠"
    elif aqi <= 200:
        return "Unhealthy", "🔴"
    elif aqi <= 300:
        return "Very Unhealthy", "🟣"
    else:
        return "Hazardous", "🔴"

def predict_aqi(model_data, pm1, pm25, temperature, humidity, hour=12, day_of_week=1, month=6, is_weekend=0, ultrafine_particles=None):
    """Make AQI prediction"""
    if model_data is None:
        return None, None
    
    model = model_data['model']
    scaler = model_data['scaler']
    feature_columns = model_data['feature_columns']
    model_name = model_data['model_name']
    
    # Prepare input data
    input_data = {
        'pm1': pm1,
        'pm25': pm25,
        'temperature': temperature,
        'humidity': humidity,
        'ultrafine_particles': ultrafine_particles or 1500.0,  # Default value
        'hour': hour,
        'day_of_week': day_of_week,
        'month': month,
        'is_weekend': is_weekend
    }
    
    # Create feature vector
    feature_vector = []
    for feature in feature_columns:
        if feature in input_data and input_data[feature] is not None:
            feature_vector.append(input_data[feature])
        else:
            # Use reasonable defaults for missing features
            defaults = {
                'ultrafine_particles': 1500.0,
                'hour': 12,
                'day_of_week': 1,
                'month': 6,
                'is_weekend': 0
            }
            feature_vector.append(defaults.get(feature, 0))
    
    feature_vector = np.array(feature_vector).reshape(1, -1)
    
    # Scale if using Linear Regression
    if model_name == 'Linear Regression':
        feature_vector = scaler.transform(feature_vector)
    
    # Make prediction
    predicted_aqi = model.predict(feature_vector)[0]
    category, emoji = get_aqi_category(predicted_aqi)
    
    return predicted_aqi, category, emoji

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

def main():
    """Main prediction interface"""
    print("🌍 AQI Prediction System")
    print("=" * 40)
    
    # Load the trained model
    model_data = load_model()
    if model_data is None:
        return
    
    print(f"✅ Loaded model: {model_data['model_name']}")
    print("\n💡 Enter air quality parameters for AQI prediction:")
    print("   (Press Ctrl+C to exit)")
    
    while True:
        try:
            print("\n" + "-" * 40)
            
            # Get user input
            pm1 = float(input("🔹 PM1 concentration (µg/m³): "))
            pm25 = float(input("🔹 PM2.5 concentration (µg/m³): "))
            temp = float(input("🔹 Temperature (°C): "))
            humidity = float(input("🔹 Relative humidity (%): "))
            
            # Optional parameters
            print("\nOptional parameters (press Enter for defaults):")
            hour_input = input("🔹 Hour (0-23, default 12): ").strip()
            hour = int(hour_input) if hour_input else 12
            
            day_input = input("🔹 Day of week (0=Mon, 6=Sun, default 1): ").strip()
            day_of_week = int(day_input) if day_input else 1
            
            # Make prediction
            predicted_aqi, category, emoji = predict_aqi(
                model_data, pm1, pm25, temp, humidity, hour, day_of_week
            )
            
            # Display results
            print("\n" + "=" * 40)
            print("🎯 PREDICTION RESULTS")
            print("=" * 40)
            print(f"{emoji} Predicted AQI: {predicted_aqi:.1f}")
            print(f"📊 Category: {category}")
            print(f"💡 Health Advice: {get_health_advice(predicted_aqi)}")
            
            # Additional information
            if predicted_aqi > 100:
                print("\n⚠️  WARNING: Air quality may be harmful to health!")
            elif predicted_aqi > 50:
                print("\n⚠️  CAUTION: Sensitive individuals should be aware.")
            else:
                print("\n✅ Good air quality - enjoy outdoor activities!")
            
            continue_pred = input("\nMake another prediction? (y/n): ").lower().strip()
            if continue_pred != 'y':
                break
                
        except KeyboardInterrupt:
            print("\n\nGoodbye! 👋")
            break
        except ValueError:
            print("❌ Please enter valid numeric values.")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()

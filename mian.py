#!/usr/bin/env python3
"""
Main execution file for AQI Machine Learning System
Simple interface to run the complete AQI analysis
"""

from aqi_ml_system import AQIMLSystem

def main():
    print("🌍 Starting AQI Machine Learning Analysis...")
    print("=" * 50)
    
    # Create and run the AQI system
    aqi_system = AQIMLSystem('openaq_location_4322233_measurments.csv')
    
    try:
        # Complete analysis pipeline
        print("1. Loading and exploring data...")
        aqi_system.load_and_explore_data()
        
        print("\n2. Preprocessing data...")
        aqi_system.preprocess_data()
        
        print("\n3. Creating visualizations...")
        aqi_system.visualize_data()
        
        print("\n4. Training ML models...")
        aqi_system.train_models()
        
        print("\n5. Creating dashboard...")
        aqi_system.create_interactive_dashboard()
        
        print("\n6. Saving model...")
        aqi_system.save_model()
        
        print("\n7. Generating report...")
        aqi_system.generate_report()
        
        print("\n✅ AQI Analysis Complete!")
        print("Check the generated files in your directory.")
        
        # Interactive prediction demo
        print("\n" + "="*50)
        print("🎯 INTERACTIVE PREDICTION DEMO")
        print("="*50)
        
        while True:
            try:
                print("\nEnter air quality parameters for AQI prediction:")
                pm1 = float(input("PM1 (µg/m³): "))
                pm25 = float(input("PM2.5 (µg/m³): "))
                temp = float(input("Temperature (°C): "))
                humidity = float(input("Humidity (%): "))
                hour = int(input("Hour (0-23, default 12): ") or "12")
                
                predicted_aqi, category = aqi_system.predict_aqi(
                    pm1=pm1, pm25=pm25, temperature=temp, humidity=humidity, hour=hour
                )
                
                print(f"\n🎯 Predicted AQI: {predicted_aqi:.1f}")
                print(f"📊 Category: {category}")
                
                # Health advice based on AQI
                if predicted_aqi <= 50:
                    advice = "Air quality is good. Ideal conditions for outdoor activities."
                elif predicted_aqi <= 100:
                    advice = "Air quality is moderate. Sensitive individuals should consider reducing prolonged outdoor activities."
                elif predicted_aqi <= 150:
                    advice = "Unhealthy for sensitive groups. People with respiratory conditions should limit outdoor activities."
                elif predicted_aqi <= 200:
                    advice = "Unhealthy air quality. Everyone should reduce outdoor activities."
                elif predicted_aqi <= 300:
                    advice = "Very unhealthy air quality. Avoid outdoor activities."
                else:
                    advice = "Hazardous air quality. Stay indoors and avoid all outdoor activities."
                
                print(f"💡 Health Advice: {advice}")
                
                continue_pred = input("\nMake another prediction? (y/n): ").lower().strip()
                if continue_pred != 'y':
                    break
                    
            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except ValueError:
                print("❌ Please enter valid numeric values.")
            except Exception as e:
                print(f"❌ Error: {e}")
    
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
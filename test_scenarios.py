#!/usr/bin/env python3
"""
AQI Test Scenarios Generator
Generates test scenarios for different air quality conditions
"""

from predict_aqi import load_model, predict_aqi, get_health_advice
import pandas as pd

def generate_test_scenarios():
    """Generate various test scenarios for AQI prediction"""
    
    scenarios = [
        {
            'name': 'Excellent Air Quality',
            'pm1': 3.0,
            'pm25': 8.0,
            'temperature': 22.0,
            'humidity': 50.0,
            'hour': 10,
            'description': 'Clean mountain air conditions'
        },
        {
            'name': 'Good Urban Air',
            'pm1': 8.0,
            'pm25': 15.0,
            'temperature': 25.0,
            'humidity': 60.0,
            'hour': 14,
            'description': 'Typical good urban air quality'
        },
        {
            'name': 'Moderate Pollution',
            'pm1': 20.0,
            'pm25': 35.0,
            'temperature': 28.0,
            'humidity': 70.0,
            'hour': 18,
            'description': 'Rush hour traffic pollution'
        },
        {
            'name': 'Unhealthy for Sensitive',
            'pm1': 35.0,
            'pm25': 65.0,
            'temperature': 32.0,
            'humidity': 80.0,
            'hour': 20,
            'description': 'High pollution evening'
        },
        {
            'name': 'Unhealthy Air',
            'pm1': 50.0,
            'pm25': 95.0,
            'temperature': 35.0,
            'humidity': 85.0,
            'hour': 22,
            'description': 'Industrial pollution or fire smoke'
        },
        {
            'name': 'Very Unhealthy',
            'pm1': 80.0,
            'pm25': 150.0,
            'temperature': 38.0,
            'humidity': 90.0,
            'hour': 23,
            'description': 'Severe pollution event'
        },
        {
            'name': 'Cold Weather Low Pollution',
            'pm1': 5.0,
            'pm25': 12.0,
            'temperature': 5.0,
            'humidity': 40.0,
            'hour': 8,
            'description': 'Cold, clear winter morning'
        },
        {
            'name': 'Hot Humid Moderate',
            'pm1': 25.0,
            'pm25': 40.0,
            'temperature': 40.0,
            'humidity': 95.0,
            'hour': 15,
            'description': 'Hot, humid tropical conditions'
        },
    ]
    
    return scenarios

def run_test_scenarios():
    """Run all test scenarios and display results"""
    print("🧪 AQI Test Scenarios")
    print("=" * 60)
    
    # Load model
    model_data = load_model()
    if model_data is None:
        print("❌ No trained model found. Please run the training first.")
        return
    
    scenarios = generate_test_scenarios()
    results = []
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n{i}. {scenario['name']}")
        print("-" * 40)
        print(f"📍 {scenario['description']}")
        print(f"🔹 PM1: {scenario['pm1']} µg/m³")
        print(f"🔹 PM2.5: {scenario['pm25']} µg/m³")
        print(f"🔹 Temperature: {scenario['temperature']}°C")
        print(f"🔹 Humidity: {scenario['humidity']}%")
        print(f"🔹 Hour: {scenario['hour']}:00")
        
        # Make prediction
        predicted_aqi, category, emoji = predict_aqi(
            model_data,
            scenario['pm1'],
            scenario['pm25'],
            scenario['temperature'],
            scenario['humidity'],
            scenario['hour']
        )
        
        print(f"\n{emoji} Predicted AQI: {predicted_aqi:.1f}")
        print(f"📊 Category: {category}")
        print(f"💡 Health Advice: {get_health_advice(predicted_aqi)}")
        
        # Store results
        results.append({
            'Scenario': scenario['name'],
            'PM1': scenario['pm1'],
            'PM2.5': scenario['pm25'],
            'Temperature': scenario['temperature'],
            'Humidity': scenario['humidity'],
            'Hour': scenario['hour'],
            'Predicted_AQI': predicted_aqi,
            'Category': category,
            'Description': scenario['description']
        })
    
    # Create summary table
    print("\n" + "=" * 60)
    print("📊 SUMMARY TABLE")
    print("=" * 60)
    
    df = pd.DataFrame(results)
    print(df[['Scenario', 'PM2.5', 'Temperature', 'Predicted_AQI', 'Category']].to_string(index=False))
    
    # Save results
    df.to_csv('aqi_test_scenarios.csv', index=False)
    print(f"\n✅ Results saved to 'aqi_test_scenarios.csv'")
    
    # Statistics
    print(f"\n📈 STATISTICS")
    print(f"Average predicted AQI: {df['Predicted_AQI'].mean():.1f}")
    print(f"Min predicted AQI: {df['Predicted_AQI'].min():.1f}")
    print(f"Max predicted AQI: {df['Predicted_AQI'].max():.1f}")
    
    category_counts = df['Category'].value_counts()
    print(f"\n📊 Category distribution:")
    for category, count in category_counts.items():
        print(f"  {category}: {count}")

def interactive_scenario_builder():
    """Interactive tool to build custom scenarios"""
    print("🛠️  Custom Scenario Builder")
    print("=" * 40)
    
    model_data = load_model()
    if model_data is None:
        return
    
    print("Build your own air quality scenario:")
    
    try:
        name = input("Scenario name: ")
        pm1 = float(input("PM1 (µg/m³): "))
        pm25 = float(input("PM2.5 (µg/m³): "))
        temp = float(input("Temperature (°C): "))
        humidity = float(input("Humidity (%): "))
        hour = int(input("Hour (0-23): "))
        description = input("Description: ")
        
        print(f"\n🔬 Testing scenario: {name}")
        print(f"📍 {description}")
        
        predicted_aqi, category, emoji = predict_aqi(
            model_data, pm1, pm25, temp, humidity, hour
        )
        
        print(f"\n{emoji} Predicted AQI: {predicted_aqi:.1f}")
        print(f"📊 Category: {category}")
        print(f"💡 Health Advice: {get_health_advice(predicted_aqi)}")
        
        # Save custom scenario
        save = input("\nSave this scenario? (y/n): ").lower().strip()
        if save == 'y':
            with open('custom_scenarios.txt', 'a') as f:
                f.write(f"{name},{pm1},{pm25},{temp},{humidity},{hour},{predicted_aqi:.1f},{category},\"{description}\"\n")
            print("✅ Scenario saved to 'custom_scenarios.txt'")
    
    except (ValueError, KeyboardInterrupt):
        print("❌ Invalid input or cancelled.")

def main():
    """Main menu"""
    print("🌍 AQI Scenario Testing Tool")
    print("=" * 40)
    print("1. Run predefined test scenarios")
    print("2. Build custom scenario")
    print("3. Exit")
    
    choice = input("\nSelect option (1-3): ").strip()
    
    if choice == '1':
        run_test_scenarios()
    elif choice == '2':
        interactive_scenario_builder()
    elif choice == '3':
        print("Goodbye! 👋")
    else:
        print("❌ Invalid choice.")

if __name__ == "__main__":
    main()

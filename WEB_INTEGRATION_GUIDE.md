# 🌐 AQI Web Integration Guide

## Complete guide for integrating AQI predictions into your web project

### 📁 Generated JSON Files Overview

Your AQI system now provides multiple JSON files optimized for different use cases:

#### 🎯 **Core Data Files**

- **`aqi_web_data.json`** - Complete dashboard data with metadata, current status, forecasts, and AQI reference
- **`current_aqi.json`** - Current AQI status only (lightweight for real-time updates)
- **`hourly_forecast.json`** - 24-hour AQI predictions
- **`daily_forecast.json`** - 7-day AQI forecast
- **`api_simulation.json`** - API endpoints simulation for development

#### 🎨 **Demo Files**

- **`aqi_web_demo.html`** - Complete working web dashboard example
- **`aqi_web_api.py`** - Flask API server for dynamic data

---

## 🚀 Integration Methods

### 1. **Static Website Integration (Recommended)**

#### **HTML/JavaScript**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>AQI Dashboard</title>
  </head>
  <body>
    <div id="aqi-display"></div>

    <script>
      // Load AQI data
      fetch("aqi_web_data.json")
        .then((response) => response.json())
        .then((data) => {
          const currentAQI = data.current.aqi;
          const category = data.current.category;

          document.getElementById("aqi-display").innerHTML = `
                <h2>Current AQI: ${currentAQI}</h2>
                <p>Category: ${category}</p>
            `;
        });
    </script>
  </body>
</html>
```

#### **React.js Component**

```jsx
import React, { useState, useEffect } from "react";

function AQIWidget() {
  const [aqiData, setAqiData] = useState(null);

  useEffect(() => {
    fetch("/aqi_web_data.json")
      .then((res) => res.json())
      .then((data) => setAqiData(data));
  }, []);

  if (!aqiData) return <div>Loading...</div>;

  return (
    <div className="aqi-widget">
      <h2>Current AQI: {aqiData.current.aqi}</h2>
      <span className={`category ${aqiData.current.category.toLowerCase()}`}>
        {aqiData.current.category}
      </span>
      <div className="parameters">
        <p>PM2.5: {aqiData.current.parameters.pm25} µg/m³</p>
        <p>Temperature: {aqiData.current.parameters.temperature}°C</p>
      </div>
    </div>
  );
}

export default AQIWidget;
```

#### **Vue.js Component**

```vue
<template>
  <div class="aqi-dashboard">
    <h2>AQI: {{ currentAQI }}</h2>
    <div :class="['category', categoryClass]">
      {{ category }}
    </div>
    <div class="forecast">
      <h3>24-Hour Forecast</h3>
      <div v-for="hour in hourlyForecast" :key="hour.datetime">
        {{ new Date(hour.datetime).getHours() }}:00 - AQI
        {{ hour.predicted_aqi }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aqiData: null,
    };
  },
  computed: {
    currentAQI() {
      return this.aqiData?.current.aqi || 0;
    },
    category() {
      return this.aqiData?.current.category || "Loading";
    },
    categoryClass() {
      return this.category.toLowerCase().replace(/\s+/g, "-");
    },
    hourlyForecast() {
      return this.aqiData?.forecasts.hourly_24h.slice(0, 12) || [];
    },
  },
  async mounted() {
    const response = await fetch("/aqi_web_data.json");
    this.aqiData = await response.json();
  },
};
</script>
```

### 2. **API-Based Integration**

#### **Start the API Server**

```bash
python aqi_web_api.py
```

#### **API Endpoints**

- `GET /api/current` - Current AQI status
- `GET /api/forecast/daily?days=7` - Daily forecast
- `GET /api/forecast/hourly?hours=24` - Hourly forecast
- `POST /api/predict` - Custom parameter prediction

#### **API Usage Examples**

```javascript
// Get current AQI
fetch("http://localhost:5000/api/current")
  .then((res) => res.json())
  .then((data) => console.log(`Current AQI: ${data.current_aqi}`));

// Get 7-day forecast
fetch("http://localhost:5000/api/forecast/daily?days=7")
  .then((res) => res.json())
  .then((data) => console.log(data.predictions));

// Predict AQI for custom parameters
fetch("http://localhost:5000/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pm1: 15.0,
    pm25: 25.0,
    temperature: 28.0,
    humidity: 65.0,
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(`Predicted AQI: ${data.predicted_aqi}`));
```

### 3. **Mobile App Integration**

#### **React Native**

```jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const AQIScreen = () => {
  const [aqiData, setAqiData] = useState(null);

  useEffect(() => {
    // Load from bundled JSON file or API
    const loadAQIData = async () => {
      try {
        const data = require("./assets/aqi_web_data.json");
        setAqiData(data);
      } catch (error) {
        console.error("Error loading AQI data:", error);
      }
    };

    loadAQIData();
  }, []);

  if (!aqiData) {
    return <Text>Loading AQI data...</Text>;
  }

  const getAQIColor = (category) => {
    const colors = {
      Good: "#00E400",
      Moderate: "#FFFF00",
      "Unhealthy for Sensitive Groups": "#FF7E00",
      Unhealthy: "#FF0000",
      "Very Unhealthy": "#8F3F97",
      Hazardous: "#7E0023",
    };
    return colors[category] || "#666";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Air Quality Index</Text>
      <Text style={styles.aqiValue}>{aqiData.current.aqi}</Text>
      <Text
        style={[
          styles.category,
          { backgroundColor: getAQIColor(aqiData.current.category) },
        ]}
      >
        {aqiData.current.category}
      </Text>
      <View style={styles.parameters}>
        <Text>PM2.5: {aqiData.current.parameters.pm25} µg/m³</Text>
        <Text>Temperature: {aqiData.current.parameters.temperature}°C</Text>
        <Text>Humidity: {aqiData.current.parameters.humidity}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  aqiValue: { fontSize: 72, fontWeight: "bold", marginBottom: 10 },
  category: {
    fontSize: 18,
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  parameters: { alignItems: "center" },
});

export default AQIScreen;
```

#### **Flutter (Dart)**

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AQIWidget extends StatefulWidget {
    @override
    _AQIWidgetState createState() => _AQIWidgetState();
}

class _AQIWidgetState extends State<AQIWidget> {
    Map<String, dynamic>? aqiData;

    @override
    void initState() {
        super.initState();
        loadAQIData();
    }

    Future<void> loadAQIData() async {
        String jsonString = await rootBundle.loadString('assets/aqi_web_data.json');
        setState(() {
            aqiData = json.decode(jsonString);
        });
    }

    Color getAQIColor(String category) {
        switch (category) {
            case 'Good': return Color(0xFF00E400);
            case 'Moderate': return Color(0xFFFFFF00);
            case 'Unhealthy for Sensitive Groups': return Color(0xFFFF7E00);
            case 'Unhealthy': return Color(0xFFFF0000);
            case 'Very Unhealthy': return Color(0xFF8F3F97);
            case 'Hazardous': return Color(0xFF7E0023);
            default: return Colors.grey;
        }
    }

    @override
    Widget build(BuildContext context) {
        if (aqiData == null) {
            return Center(child: CircularProgressIndicator());
        }

        final current = aqiData!['current'];
        final category = current['category'];

        return Container(
            padding: EdgeInsets.all(20),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                    Text('Air Quality Index',
                         style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    SizedBox(height: 20),
                    Text('${current['aqi']}',
                         style: TextStyle(fontSize: 72, fontWeight: FontWeight.bold)),
                    Container(
                        padding: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
                        decoration: BoxDecoration(
                            color: getAQIColor(category),
                            borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(category,
                                  style: TextStyle(color: Colors.white, fontSize: 16)),
                    ),
                    SizedBox(height: 30),
                    Column(
                        children: [
                            Text('PM2.5: ${current['parameters']['pm25']} µg/m³'),
                            Text('Temperature: ${current['parameters']['temperature']}°C'),
                            Text('Humidity: ${current['parameters']['humidity']}%'),
                        ],
                    ),
                ],
            ),
        );
    }
}
```

---

## 📊 Data Structure Reference

### **aqi_web_data.json Structure**

```json
{
  "metadata": {
    "api_version": "1.0",
    "generated_at": "ISO timestamp",
    "model_accuracy": "99.95%",
    "location": "Cambodia (Phnom Penh area)",
    "coordinates": { "latitude": 11.598675, "longitude": 104.8013326 }
  },
  "current": {
    "aqi": 63.0,
    "category": "Moderate",
    "timestamp": "ISO timestamp",
    "parameters": {
      "pm1": 12.08,
      "pm25": 20.46,
      "temperature": 29.3,
      "humidity": 57.8,
      "ultrafine_particles": 1790.3
    }
  },
  "forecasts": {
    "hourly_24h": [
      /* 24 hourly predictions */
    ],
    "daily_7d": [
      /* 7 daily predictions */
    ]
  },
  "aqi_reference": {
    "Good": { "min": 0, "max": 50, "color": "#00E400" }
    /* ... other categories */
  },
  "parameters_info": {
    /* parameter descriptions */
  }
}
```

---

## 🎨 CSS Styling Guide

```css
/* AQI Color Classes */
.aqi-good {
  background-color: #00e400;
}
.aqi-moderate {
  background-color: #ffff00;
  color: #000;
}
.aqi-unhealthy-sensitive {
  background-color: #ff7e00;
}
.aqi-unhealthy {
  background-color: #ff0000;
}
.aqi-very-unhealthy {
  background-color: #8f3f97;
}
.aqi-hazardous {
  background-color: #7e0023;
}

/* AQI Widget Styles */
.aqi-widget {
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
}

.aqi-value {
  font-size: 3em;
  font-weight: bold;
  margin: 10px 0;
}

.aqi-category {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.parameter-item {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}
```

---

## 🚀 Deployment Options

### **1. Static Site Hosting**

- **GitHub Pages**: Push files to gh-pages branch
- **Netlify**: Drag & drop files or connect Git repo
- **Vercel**: Deploy with zero configuration
- **AWS S3**: Upload files to S3 bucket with static hosting

### **2. API Server Deployment**

- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean App Platform**: Deploy from Git
- **AWS Lambda**: Serverless deployment

### **3. CDN Integration**

```html
<!-- Load AQI data from CDN -->
<script>
  const AQI_DATA_URL = "https://your-cdn.com/aqi_web_data.json";
  fetch(AQI_DATA_URL)
    .then((res) => res.json())
    .then(displayAQI);
</script>
```

---

## 🔄 Auto-Update Strategies

### **1. Scheduled Updates**

```javascript
// Auto-refresh every 10 minutes
setInterval(() => {
  fetch("aqi_web_data.json")
    .then((res) => res.json())
    .then(updateDisplay);
}, 10 * 60 * 1000);
```

### **2. Service Worker Caching**

```javascript
// service-worker.js
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("aqi_web_data.json")) {
    event.respondWith(
      caches.open("aqi-cache").then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  }
});
```

---

## 📱 Progressive Web App (PWA) Features

### **manifest.json**

```json
{
  "name": "AQI Monitor",
  "short_name": "AQI",
  "description": "Real-time Air Quality Index monitoring",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🎯 Integration Checklist

- [ ] **Copy JSON files** to your project directory
- [ ] **Test data loading** with fetch() or import
- [ ] **Implement AQI display** with proper colors
- [ ] **Add parameter display** (PM2.5, temperature, etc.)
- [ ] **Create forecast views** (hourly/daily)
- [ ] **Style with CSS** using provided color scheme
- [ ] **Add responsive design** for mobile devices
- [ ] **Implement auto-refresh** for real-time updates
- [ ] **Add error handling** for failed data loads
- [ ] **Test on different browsers** and devices

---

## 🆘 Troubleshooting

### **CORS Issues**

If loading JSON files locally fails due to CORS:

1. Serve files through a local server: `python -m http.server 8000`
2. Use browser flags: `--allow-file-access-from-files`
3. Deploy to a web server

### **Data Not Loading**

1. Check JSON file path is correct
2. Verify JSON syntax with online validator
3. Check browser console for errors
4. Ensure files are in web-accessible directory

### **Mobile Display Issues**

1. Add viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
2. Use responsive CSS units (rem, %, vw, vh)
3. Test on actual devices, not just browser dev tools

---

## 💡 Advanced Features

### **Custom AQI Thresholds**

```javascript
const customThresholds = {
  good: 45, // Instead of 50
  moderate: 95, // Instead of 100
  // ... custom ranges
};
```

### **Multiple Locations**

```javascript
const locations = [
  { name: "Phnom Penh", data: "phnom_penh_aqi.json" },
  { name: "Siem Reap", data: "siem_reap_aqi.json" },
];
```

### **Historical Data Charts**

```javascript
// Using Chart.js
const ctx = document.getElementById("aqiChart");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: hourlyData.map((h) => new Date(h.datetime).getHours()),
    datasets: [
      {
        label: "AQI",
        data: hourlyData.map((h) => h.predicted_aqi),
        borderColor: "#667eea",
      },
    ],
  },
});
```

---

Your AQI prediction system is now fully ready for web integration! 🚀

# 🚀 **HOW TO RUN YOUR AQI MACHINE LEARNING SYSTEM**

## 🎯 **EASIEST WAY - Use the Run Script**

### **Super Simple - One Command:**

```bash
cd /home/nomm/Desktop/MachineLearning
./run_aqi_system.sh
```

**Then select option 5 for complete automated setup!**

---

## 📋 **MANUAL QUICK START GUIDE**

### **1. 🏃 Run the Complete ML System**

```bash
# Navigate to your project directory
cd /home/nomm/Desktop/MachineLearning

# Run the main AQI system (trains model, generates reports, visualizations)
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_ml_system.py

```

### **2. 🔮 Run Future Predictions**

```bash
# Run interactive future prediction system
/home/nomm/Desktop/MachineLearning/.venv/bin/python future_predictions.py
```

**Options available:**

- **Single date prediction** - Predict AQI for specific future date
- **Date range prediction** - Predict AQI for multiple days
- **Generate JSON for web** - Create web-ready prediction files

### **3. 📡 Run API Server**

```bash
# Start the REST API server
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_api_server.py
```

**Server starts on:** `http://localhost:5000`

### **4. 🧪 Test the API**

```bash
# Run comprehensive API tests
/home/nomm/Desktop/MachineLearning/.venv/bin/python test_api_client.py
```

### **5. 🌐 Generate Web JSON Files**

```bash
# Generate all JSON files for web integration
/home/nomm/Desktop/MachineLearning/.venv/bin/python generate_web_json.py
```

---

## 🎯 **STEP-BY-STEP EXECUTION**

### **Step 1: Train the ML Model**

```bash
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_ml_system.py
```

**What this does:**

- ✅ Loads your CSV data (5000 measurements)
- ✅ Trains machine learning models
- ✅ Achieves 99.95% accuracy
- ✅ Saves trained model as `aqi_model.pkl`
- ✅ Generates comprehensive analysis report
- ✅ Creates visualizations in `plots/` folder

**Expected output:**

```
🌍 AQI Machine Learning System
================================
📊 Data loaded: 5000 measurements
🧹 Data preprocessing complete
🤖 Training models...
🏆 Best Model: Gradient Boosting Regressor
📊 R² Score: 0.9995
📊 RMSE: 0.49
✅ Model saved successfully
```

### **Step 2: Start API Server**

```bash
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_api_server.py
```

**What this does:**

- ✅ Loads the trained ML model
- ✅ Starts Flask web server on port 5000
- ✅ Enables CORS for web integration
- ✅ Provides 10 REST API endpoints

**Expected output:**

```
🚀 Starting AQI Machine Learning API Server...
✅ ML Model loaded successfully
✅ AQI web data loaded successfully
📡 Available API Endpoints:
• GET  /api/current               - Current AQI data
• POST /api/predict               - Predict AQI from parameters
🌐 Server starting on http://localhost:5000
```

### **Step 3: Test API Endpoints**

**Open a new terminal window:**

```bash
# Test current AQI
curl http://localhost:5000/api/current

# Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"pm25": 25.5, "temperature": 30, "humidity": 65}'

# Or run comprehensive tests
/home/nomm/Desktop/MachineLearning/.venv/bin/python test_api_client.py
```

### **Step 4: Generate Future Predictions**

```bash
/home/nomm/Desktop/MachineLearning/.venv/bin/python future_predictions.py
```

**Interactive menu:**

```
📅 Future Prediction Options:
1. Single date prediction
2. Date range prediction
3. Generate JSON for web project
4. Exit
```

**Example usage:**

- **Option 1:** Predict AQI for July 30, 2025
- **Option 2:** Predict AQI for next 7 days
- **Option 3:** Generate JSON files for web integration

---

## 🌐 **API ENDPOINTS USAGE**

### **Available Endpoints:**

```http
# API Information
GET http://localhost:5000/

# Current AQI Data
GET http://localhost:5000/api/current

# Predict AQI
POST http://localhost:5000/api/predict
Body: {"pm25": 25.5, "temperature": 30, "humidity": 65}

# Health Advice
GET http://localhost:5000/api/health-advice/75.5

# Hourly Forecast
GET http://localhost:5000/api/forecast/hourly?hours=24

# Daily Forecast
GET http://localhost:5000/api/forecast/daily?days=7

# Complete Data
GET http://localhost:5000/api/data/full

# Metadata
GET http://localhost:5000/api/data/metadata

# Locations
GET http://localhost:5000/api/locations

# Parameters Info
GET http://localhost:5000/api/parameters
```

### **JavaScript Integration Example:**

```javascript
// Get current AQI
fetch("http://localhost:5000/api/current")
  .then((response) => response.json())
  .then((data) => {
    console.log(`AQI: ${data.data.aqi} (${data.data.category})`);
  });

// Predict AQI
fetch("http://localhost:5000/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pm25: 25.5,
    temperature: 30,
    humidity: 65,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(`Predicted AQI: ${data.data.predicted_aqi}`);
  });
```

---

## 📱 **WEB INTEGRATION**

### **Option 1: Use Static JSON Files**

```bash
# Generate all JSON files for static integration
/home/nomm/Desktop/MachineLearning/.venv/bin/python generate_web_json.py
```

**Generated files:**

- `aqi_web_data.json` - Main dashboard data
- `current_aqi.json` - Current status
- `hourly_forecast.json` - 24-hour forecast
- `daily_forecast.json` - 7-day forecast
- `api_simulation.json` - Complete API simulation

### **Option 2: Use Live API**

**Keep the API server running:**

```bash
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_api_server.py
```

**Then integrate with your web app using the API endpoints**

### **Option 3: Use Demo Web Page**

**Open the included demo:**

```bash
# Open in browser
firefox aqi_web_demo.html
# or
google-chrome aqi_web_demo.html
```

---

## 🔧 **TROUBLESHOOTING**

### **If you get "Module not found" errors:**

```bash
# Install missing packages
/home/nomm/Desktop/MachineLearning/.venv/bin/pip install flask flask-cors requests scikit-learn pandas numpy matplotlib seaborn plotly
```

### **If API server won't start:**

```bash
# Check if port 5000 is available
lsof -i :5000

# Kill any existing process on port 5000
sudo kill -9 $(lsof -t -i:5000)

# Try running on different port
# Edit aqi_api_server.py and change port=5000 to port=5001
```

### **If model file is missing:**

```bash
# First run the main system to train and save the model
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_ml_system.py
```

---

## 🎯 **COMPLETE WORKFLOW**

### **For Development:**

```bash
# 1. Train the model
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_ml_system.py

# 2. Generate web JSON files
/home/nomm/Desktop/MachineLearning/.venv/bin/python generate_web_json.py

# 3. Start API server (in background)
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_api_server.py &

# 4. Test everything works
/home/nomm/Desktop/MachineLearning/.venv/bin/python test_api_client.py
```

### **For Production:**

```bash
# 1. Train and save model
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_ml_system.py

# 2. Deploy API server
/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_api_server.py

# 3. Use JSON files in your web application
cp *.json /path/to/your/web/project/
```

---

## 🎊 **SUCCESS INDICATORS**

### **✅ System is working correctly when you see:**

**ML System:**

```
🏆 Best Model: Gradient Boosting Regressor
📊 R² Score: 0.9995
📊 RMSE: 0.49
✅ Model saved successfully
```

**API Server:**

```
✅ ML Model loaded successfully
🌐 Server starting on http://localhost:5000
 * Running on http://127.0.0.1:5000
```

**API Tests:**

```
✅ Status: success
🌤️  Current AQI: 58.9 (Moderate)
⚡ Average Response Time: 0.002 seconds
🎉 API Test Suite Complete!
```

---

## 🚀 **READY TO USE!**

Your AQI machine learning system is now **fully operational** with:

✅ **99.95% accurate ML model**  
✅ **Complete REST API (10 endpoints)**  
✅ **Future prediction capabilities**  
✅ **Web-ready JSON files**  
✅ **Interactive demo**  
✅ **Comprehensive documentation**

**Start with:** `/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_ml_system.py`

**Then run:** `/home/nomm/Desktop/MachineLearning/.venv/bin/python aqi_api_server.py`

**Your API will be live at:** `http://localhost:5000` 🎉

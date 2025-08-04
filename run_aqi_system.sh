#!/bin/bash
# AQI System Quick Start Script

echo "🚀 AQI Machine Learning System - Quick Start"
echo "=============================================="

PYTHON_PATH="/home/nomm/Desktop/MachineLearning/.venv/bin/python"

# Function to run commands with error handling
run_command() {
    echo ""
    echo "🔄 $2"
    echo "----------------------------------------"
    if $PYTHON_PATH "$1"; then
        echo "✅ $2 completed successfully!"
    else
        echo "❌ $2 failed!"
        return 1
    fi
}

echo ""
echo "📋 Available options:"
echo "1. Run complete ML system (train model, generate reports)"
echo "2. Generate JSON files for web integration" 
echo "3. Start API server (keep running)"
echo "4. Test API endpoints"
echo "5. Run all steps automatically"
echo ""

read -p "Select option (1-5): " choice

case $choice in
    1)
        run_command "aqi_ml_system.py" "ML System Training"
        ;;
    2)
        run_command "generate_web_json.py" "JSON Generation"
        ;;
    3)
        echo ""
        echo "🌐 Starting API Server..."
        echo "Server will run on: http://localhost:5000"
        echo "Press Ctrl+C to stop the server"
        echo "----------------------------------------"
        $PYTHON_PATH aqi_api_server.py
        ;;
    4)
        echo ""
        echo "🧪 Testing API Endpoints..."
        echo "Make sure API server is running first!"
        echo "----------------------------------------"
        $PYTHON_PATH test_api_client.py
        ;;
    5)
        echo ""
        echo "🎯 Running complete setup..."
        echo "This will take a few minutes..."
        echo "----------------------------------------"
        
        # Step 1: Train ML model
        run_command "aqi_ml_system.py" "ML System Training" || exit 1
        
        # Step 2: Generate JSON files
        run_command "generate_web_json.py" "JSON Generation" || exit 1
        
        # Step 3: Start API server in background
        echo ""
        echo "🌐 Starting API Server in background..."
        $PYTHON_PATH aqi_api_server.py &
        API_PID=$!
        sleep 3
        
        # Step 4: Test API
        echo ""
        echo "🧪 Testing API..."
        $PYTHON_PATH test_api_client.py
        
        echo ""
        echo "🎉 Complete setup finished!"
        echo "API Server is running with PID: $API_PID"
        echo "Visit: http://localhost:5000"
        echo "To stop server: kill $API_PID"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎊 Done! Your AQI system is ready!"

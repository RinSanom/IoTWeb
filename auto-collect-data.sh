#!/bin/bash

# Auto data collection script
# Run this script to automatically save data every 5 minutes

echo "🚀 Starting automatic air quality data collection..."
echo "📊 Data will be saved to PostgreSQL database every 5 minutes"
echo "🔄 Press Ctrl+C to stop"
echo "=========================================="

# Function to handle script termination
cleanup() {
    echo ""
    echo "🛑 Stopping automatic data collection..."
    echo "✅ Auto-collection stopped gracefully"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

while true; do
    echo "$(date): 📡 Collecting air quality data..."
    
    # Call the auto-collect API endpoint
    response=$(curl -s -w "HTTP_CODE:%{http_code}" "http://localhost:3000/api/air-quality/auto-collect")
    
    # Extract HTTP status code
    http_code=$(echo "$response" | sed -n 's/.*HTTP_CODE:\([0-9]*\)$/\1/p')
    json_response=$(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Success: Data collected and saved to database"
        echo "$json_response" | jq '.message, .timestamp' 2>/dev/null || echo "$json_response"
    else
        echo "❌ Error: HTTP $http_code"
        echo "$json_response" | jq '.error, .details' 2>/dev/null || echo "$json_response"
    fi
    
    echo "⏰ Waiting 5 minutes for next collection..."
    echo "----------------------------------------"
    sleep 300  # Wait 5 minutes (300 seconds)
done

#!/bin/bash

# Auto data collection script
# Run this script to automatically save data every 5 minutes

echo "Starting automatic data collection..."

while true; do
    echo "$(date): Collecting air quality data..."
    
    # Call the auto-save API endpoint
    curl -s "http://localhost:3000/api/air-quality/auto-save" | jq '.'
    
    echo "Waiting 30 minutes for next collection..."
    sleep 600  # Wait 5 minutes (300 seconds)
done

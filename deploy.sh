#!/bin/bash
# Production deployment script for AQI API

echo "🚀 Starting AQI API Production Deployment..."

# Install production requirements
echo "📦 Installing production dependencies..."
pip install -r requirements-prod.txt

# Create logs directory
mkdir -p logs

# Stop any existing Gunicorn processes
echo "🔄 Stopping existing processes..."
pkill -f gunicorn || true

# Start Gunicorn with configuration
echo "🌟 Starting AQI API with Gunicorn..."
gunicorn -c gunicorn.conf.py wsgi:app

echo "✅ AQI API is now running in production mode!"
echo "🌐 Access the API at: http://localhost:5000"
echo "📊 Monitor logs: tail -f access.log error.log"
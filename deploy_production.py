#!/usr/bin/env python3
"""
Production deployment script for AQI Machine Learning API
Uses Gunicorn WSGI server for production-ready deployment
"""

import os
import sys
from aqi_api_server import app

def create_gunicorn_config():
    """Create Gunicorn configuration file"""
    config_content = """
# Gunicorn configuration file for AQI API
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
preload_app = True
accesslog = "access.log"
errorlog = "error.log"
loglevel = "info"
pidfile = "gunicorn.pid"
daemon = False
"""
    
    with open('gunicorn.conf.py', 'w') as f:
        f.write(config_content.strip())
    
    print("✅ Created gunicorn.conf.py")

def create_wsgi_file():
    """Create WSGI entry point"""
    wsgi_content = """
from aqi_api_server import app

if __name__ == "__main__":
    app.run()
"""
    
    with open('wsgi.py', 'w') as f:
        f.write(wsgi_content.strip())
    
    print("✅ Created wsgi.py")

def create_production_requirements():
    """Create production requirements file"""
    prod_requirements = """
# Production requirements for AQI API
flask>=2.3.0
flask-cors>=4.0.0
numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
joblib>=1.3.0
gunicorn>=21.2.0
python-dotenv>=1.0.0
"""
    
    with open('requirements-prod.txt', 'w') as f:
        f.write(prod_requirements.strip())
    
    print("✅ Created requirements-prod.txt")

def create_deployment_script():
    """Create deployment script"""
    deploy_script = """#!/bin/bash
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
"""
    
    with open('deploy.sh', 'w') as f:
        f.write(deploy_script.strip())
    
    # Make script executable
    os.chmod('deploy.sh', 0o755)
    print("✅ Created deploy.sh (executable)")

def create_systemd_service():
    """Create systemd service file for auto-start"""
    service_content = f"""[Unit]
Description=AQI Machine Learning API
After=network.target

[Service]
Type=forking
User=nomm
Group=nomm
WorkingDirectory={os.getcwd()}
Environment=PATH={os.getcwd()}/venv/bin
ExecStart={os.getcwd()}/venv/bin/gunicorn -c gunicorn.conf.py wsgi:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
"""
    
    with open('aqi-api.service', 'w') as f:
        f.write(service_content.strip())
    
    print("✅ Created aqi-api.service (systemd service)")
    print("   To install: sudo cp aqi-api.service /etc/systemd/system/")
    print("   To enable: sudo systemctl enable aqi-api")
    print("   To start: sudo systemctl start aqi-api")

if __name__ == "__main__":
    print("🔧 Setting up production deployment for AQI API...")
    print("-" * 50)
    
    create_gunicorn_config()
    create_wsgi_file()
    create_production_requirements()
    create_deployment_script()
    create_systemd_service()
    
    print("-" * 50)
    print("🎉 Production setup complete!")
    print("\n📋 Next steps:")
    print("1. Install production dependencies: pip install -r requirements-prod.txt")
    print("2. Run production server: ./deploy.sh")
    print("3. Or manually: gunicorn -c gunicorn.conf.py wsgi:app")
    print("\n🔍 Production features enabled:")
    print("   ✅ Multi-worker processing")
    print("   ✅ Production WSGI server")
    print("   ✅ Request logging")
    print("   ✅ Error handling")
    print("   ✅ Auto-restart capability")
    print("   ✅ Systemd integration")

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
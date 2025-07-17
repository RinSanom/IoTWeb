#!/bin/bash

# Test script for authentication API endpoints
API_BASE="http://127.0.0.1:8000"

echo "🧪 Testing Authentication API Endpoints"
echo "========================================="

# Test Registration
echo "📝 Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST \
  "$API_BASE/auth/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "123456789"
  }')

echo "Register Response: $REGISTER_RESPONSE"

# Test Login
echo ""
echo "🔐 Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST \
  "$API_BASE/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rinsanom@gmail.com",
    "password": "123456789"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract access token for profile test
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$ACCESS_TOKEN" ]; then
  echo ""
  echo "👤 Testing Profile with token..."
  PROFILE_RESPONSE=$(curl -s -X GET \
    "$API_BASE/auth/profile/" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json")
  
  echo "Profile Response: $PROFILE_RESPONSE"
else
  echo "❌ No access token received from login"
fi

echo ""
echo "✅ API test completed!"

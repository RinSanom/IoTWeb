#!/usr/bin/env node

/**
 * Test script for IoT Web Air Quality API
 * Run with: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Test data
const testAQIData = {
    pm2_5: 15.2,
    pm10: 25.5,
    no2: 12.1,
    o3: 45.3,
    co: 0.8,
    so2: 8.2,
    nh3: 3.1,
    pb: 0.02
};

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonBody = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonBody });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Running API Tests...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing health endpoint...');
        const health = await makeRequest('GET', '/health');
        console.log(`   Status: ${health.status}`);
        console.log(`   Response: ${JSON.stringify(health.data, null, 2)}\n`);

        // Test 2: Root endpoint
        console.log('2️⃣ Testing root endpoint...');
        const root = await makeRequest('GET', '/');
        console.log(`   Status: ${root.status}`);
        console.log(`   Message: ${root.data.message}\n`);

        // Test 3: Create AQI data
        console.log('3️⃣ Testing create AQI data...');
        const createAQI = await makeRequest('POST', '/api/aqi', testAQIData);
        console.log(`   Status: ${createAQI.status}`);
        console.log(`   Response: ${JSON.stringify(createAQI.data, null, 2)}\n`);

        // Test 4: Get all AQI data
        console.log('4️⃣ Testing get all AQI data...');
        const getAllAQI = await makeRequest('GET', '/api/aqi');
        console.log(`   Status: ${getAllAQI.status}`);
        console.log(`   Count: ${Array.isArray(getAllAQI.data) ? getAllAQI.data.length : 'N/A'}\n`);

        // Test 5: Get latest AQI data
        console.log('5️⃣ Testing get latest AQI data...');
        const getLatest = await makeRequest('GET', '/api/aqi/latest');
        console.log(`   Status: ${getLatest.status}`);
        if (getLatest.data.id) {
            console.log(`   Latest ID: ${getLatest.data.id}`);
            console.log(`   Level: ${getLatest.data.level}\n`);
        } else {
            console.log(`   Response: ${JSON.stringify(getLatest.data, null, 2)}\n`);
        }

        // Test 6: MQTT publish
        console.log('6️⃣ Testing MQTT publish...');
        const mqttData = {
            topic: 'test/topic',
            message: 'Hello from API test!'
        };
        const mqttPublish = await makeRequest('POST', '/mqtt/publish', mqttData);
        console.log(`   Status: ${mqttPublish.status}`);
        console.log(`   Response: ${JSON.stringify(mqttPublish.data, null, 2)}\n`);

        console.log('✅ All tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure the server is running on http://localhost:3001');
        console.log('   Start with: npm run dev');
    }
}

// Run tests
runTests();

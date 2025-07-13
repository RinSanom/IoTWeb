import mqtt from 'mqtt';
import { AQIService } from './service/aqi_service';
import { AQIImp } from './repository/api_repository_imp';
import { CreateAQIRequest } from './types/types';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const client = mqtt.connect(MQTT_BROKER_URL);

// Initialize AQI service for processing incoming data
const aqiRepository = new AQIImp();
const aqiService = new AQIService(aqiRepository);

client.on('connect', () => {
    console.log('✅ Connected to MQTT broker at:', MQTT_BROKER_URL);

    // Subscribe to AQI data topics
    const topics = [
        'aqi/data',
        'sensors/air-quality',
        'iot/air-quality'
    ];

    topics.forEach(topic => {
        client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`📡 Subscribed to topic: ${topic}`);
            } else {
                console.error(`❌ Failed to subscribe to ${topic}:`, err);
            }
        });
    });
});

client.on('message', async (topic, message) => {
    const messageStr = message.toString();
    console.log(`📥 Received message on ${topic}: ${messageStr}`);

    // Handle AQI data messages
    if (topic.includes('aqi') || topic.includes('air-quality')) {
        try {
            const data = JSON.parse(messageStr);

            // Validate that we have the required AQI data structure
            if (isValidAQIData(data)) {
                const aqiData: CreateAQIRequest = {
                    pm2_5: data.pm2_5 || data.PM25 || 0,
                    pm10: data.pm10 || data.PM10 || 0,
                    no2: data.no2 || data.NO2 || 0,
                    o3: data.o3 || data.O3 || 0,
                    co: data.co || data.CO || 0,
                    so2: data.so2 || data.SO2 || 0,
                    nh3: data.nh3 || data.NH3 || 0,
                    pb: data.pb || data.PB || 0
                };

                // Save to database
                const savedAqi = await aqiService.createAQI(aqiData);
                const level = aqiService.calculateAQILevel(savedAqi);

                console.log(`💾 Saved AQI data with ID: ${savedAqi.id}, Level: ${level}`);

                // Optionally publish processed data to a different topic
                publishMessage('aqi/processed', JSON.stringify({
                    ...savedAqi,
                    level,
                    processedAt: new Date().toISOString()
                }));

            } else {
                console.warn('⚠️ Received invalid AQI data format:', data);
            }
        } catch (error) {
            console.error('❌ Error processing AQI message:', error);
        }
    }
});

client.on('error', (error) => {
    console.error('❌ MQTT connection error:', error);
});

client.on('close', () => {
    console.log('🔌 MQTT connection closed');
});

client.on('reconnect', () => {
    console.log('🔄 Reconnecting to MQTT broker...');
});

// Helper function to validate AQI data
function isValidAQIData(data: any): boolean {
    return data && typeof data === 'object' && (
        data.pm2_5 !== undefined || data.PM25 !== undefined ||
        data.pm10 !== undefined || data.PM10 !== undefined ||
        data.no2 !== undefined || data.NO2 !== undefined ||
        data.o3 !== undefined || data.O3 !== undefined ||
        data.co !== undefined || data.CO !== undefined ||
        data.so2 !== undefined || data.SO2 !== undefined ||
        data.nh3 !== undefined || data.NH3 !== undefined ||
        data.pb !== undefined || data.PB !== undefined
    );
}

export const publishMessage = (topic: string, msg: string) => {
    if (client.connected) {
        client.publish(topic, msg, (error) => {
            if (error) {
                console.error(`❌ Failed to publish to ${topic}:`, error);
            } else {
                console.log(`📤 Published message to ${topic}`);
            }
        });
    } else {
        console.warn('⚠️ MQTT client not connected. Cannot publish message.');
    }
};

// Function to publish AQI alerts based on levels
export const publishAQIAlert = (aqiData: any, level: string) => {
    const alert = {
        timestamp: new Date().toISOString(),
        level,
        data: aqiData,
        message: getAQIMessage(level)
    };

    publishMessage('aqi/alerts', JSON.stringify(alert));
};

function getAQIMessage(level: string): string {
    const messages = {
        'Good': 'Air quality is satisfactory and poses little or no risk.',
        'Moderate': 'Air quality is acceptable for most people.',
        'Unhealthy for Sensitive Groups': 'Sensitive groups may experience minor to moderate symptoms.',
        'Unhealthy': 'Everyone may begin to experience some adverse health effects.',
        'Very Unhealthy': 'Health alert: everyone may experience more serious health effects.',
        'Hazardous': 'Health warning of emergency conditions. Everyone should avoid outdoor activities.'
    };

    return messages[level as keyof typeof messages] || 'Unknown air quality level.';
}

export default client;

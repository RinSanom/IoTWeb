import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'mqtt://localhost:1883';
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');
    client.subscribe('my/topic', (err) => {
        if (!err) {
            console.log('📡 Subscribed to topic: my/topic');
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`📥 Received message on ${topic}: ${message.toString()}`);
});

export const publishMessage = (topic: string, msg: string) => {
    client.publish(topic, msg);
};

export default client;

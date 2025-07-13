import { useEffect, useState, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface UseMQTTProps {
    brokerUrl: string; // e.g. 'ws://localhost:9001'
    subscribeTopics: string | string[]; // topic(s) to subscribe to
    options?: mqtt.IClientOptions; // optional mqtt.js options
}

export function useMQTT({ brokerUrl, subscribeTopics, options }: UseMQTTProps) {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const clientRef = useRef<MqttClient | null>(null);

    useEffect(() => {
        const client = mqtt.connect(brokerUrl, options);

        clientRef.current = client;

        client.on('connect', () => {
            setConnected(true);
            if (typeof subscribeTopics === 'string') {
                client.subscribe(subscribeTopics);
            } else if (Array.isArray(subscribeTopics)) {
                subscribeTopics.forEach(topic => client.subscribe(topic));
            }
        });

        client.on('message', (topic, payload) => {
            const msg = payload.toString();
            setMessages(prev => [...prev, `${topic}: ${msg}`]);
        });

        client.on('error', (err) => {
            console.error('MQTT connection error:', err);
            setConnected(false);
            client.end();
        });

        return () => {
            client.end();
        };
    }, [brokerUrl, subscribeTopics, options]);

    const publish = useCallback((topic: string, message: string) => {
        if (clientRef.current && connected) {
            clientRef.current.publish(topic, message);
        } else {
            console.warn('MQTT client not connected yet');
        }
    }, [connected]);

    return { connected, messages, publish };
}

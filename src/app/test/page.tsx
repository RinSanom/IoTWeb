'use client'

import { useMQTT } from '@/lib/hooks/mqtt'
import { useState } from 'react'

export default function MQTTDemo() {
    const { connected, messages, publish } = useMQTT({
        brokerUrl: 'ws://localhost:9001',
        subscribeTopics: 'my/topic',
    });

    const [input, setInput] = useState('');

    return (
        <main className='h-screen flex flex-col justify-center items-center'>
            <h1>MQTT Hook Demo</h1>
            <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message"
            />
            <button onClick={() => {
                publish('my/topic', input)
                setInput('');
            }}>
                Publish
            </button>

            <h3>Messages:</h3>
            <ul>
                {messages.map((m, i) => (
                    <li key={i}>{m}</li>
                ))}
            </ul>
        </main>
    );
}

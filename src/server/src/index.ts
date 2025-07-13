import express from 'express';
import { publishMessage } from './mqtt-client';

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hello from TypeScript backend!');
});

app.post('/publish', (req, res) => {
    const { topic, message } = req.body;
    publishMessage(topic, message);
    res.send(`Message sent to ${topic}`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

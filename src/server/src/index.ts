import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { publishMessage } from './mqtt-client';
import { AQIController } from './controller/aqi_controller';
import { AQIService } from './service/aqi_service';
import { AQIImp } from './repository/api_repository_imp';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS manually
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Initialize dependencies
const aqiRepository = new AQIImp();
const aqiService = new AQIService(aqiRepository);
const aqiController = new AQIController(aqiService);

// Basic routes
app.get('/', (req, res) => {
    res.json({
        message: 'IoT Air Quality API Server',
        version: '1.0.0',
        endpoints: {
            'GET /api/aqi': 'Get all AQI data',
            'GET /api/aqi/latest': 'Get latest AQI data',
            'GET /api/aqi/:id': 'Get AQI data by ID',
            'GET /api/aqi/date/:date': 'Get AQI data by date (YYYY-MM-DD)',
            'GET /api/aqi/range': 'Get AQI data by date range (?startDate=...&endDate=...)',
            'POST /api/aqi': 'Create new AQI data',
            'POST /mqtt/publish': 'Publish MQTT message'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// AQI Routes
app.get('/api/aqi', (req, res) => aqiController.getAllAQI(req, res));
app.get('/api/aqi/latest', (req, res) => aqiController.getLatestAQI(req, res));
app.get('/api/aqi/:id', (req, res) => aqiController.getAQIById(req, res));
app.get('/api/aqi/date/:date', (req, res) => aqiController.getAQIByDate(req, res));
app.get('/api/aqi/range', (req, res) => aqiController.getAQIByDateRange(req, res));
app.post('/api/aqi', (req, res) => aqiController.createAQI(req, res));

// MQTT Routes
app.post('/mqtt/publish', (req, res) => {
    try {
        const { topic, message } = req.body;

        if (!topic || !message) {
            return res.status(400).json({ error: 'Topic and message are required' });
        }

        publishMessage(topic, message);
        res.json({
            success: true,
            message: `Message sent to topic: ${topic}`,
            data: { topic, message }
        });
    } catch (error) {
        console.error('Error publishing MQTT message:', error);
        res.status(500).json({ error: 'Failed to publish message' });
    }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📊 API Documentation available at http://localhost:${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
});

export default app;

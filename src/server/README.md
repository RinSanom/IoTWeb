# IoT Web Air Quality Server

This is the backend server for the IoT Air Quality monitoring system. It provides REST APIs for air quality data and handles MQTT communication.

## Features

- 🌬️ Air Quality Index (AQI) data management
- 📡 MQTT integration for IoT sensors
- 🗄️ PostgreSQL database with Prisma ORM
- 🔄 Real-time data processing
- 📊 Air quality level calculation and alerts
- 🛡️ TypeScript for type safety

## Setup Instructions

### 1. Install Dependencies

```bash
cd src/server
npm install
```

### 2. Environment Configuration

Copy the example environment file and update it with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your database and MQTT broker settings:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/iotweb_db"
MQTT_BROKER_URL="mqtt://localhost:1883"
PORT=3001
```

### 3. Database Setup

Initialize the database and run migrations:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Air Quality Data

- `GET /api/aqi` - Get all AQI data
- `GET /api/aqi/latest` - Get latest AQI reading
- `GET /api/aqi/:id` - Get AQI data by ID
- `GET /api/aqi/date/:date` - Get AQI data for a specific date (YYYY-MM-DD)
- `GET /api/aqi/range?startDate=...&endDate=...` - Get AQI data for date range
- `POST /api/aqi` - Create new AQI data

### MQTT

- `POST /mqtt/publish` - Publish message to MQTT topic

### Health Check

- `GET /health` - Server health status

## MQTT Topics

The server automatically subscribes to these topics for AQI data:

- `aqi/data` - Air quality sensor data
- `sensors/air-quality` - Generic air quality data
- `iot/air-quality` - IoT air quality data

### Data Format

Send AQI data in JSON format:

```json
{
  "pm2_5": 15.2,
  "pm10": 25.5,
  "no2": 12.1,
  "o3": 45.3,
  "co": 0.8,
  "so2": 8.2,
  "nh3": 3.1,
  "pb": 0.02
}
```

## Air Quality Levels

The system calculates AQI levels based on PM2.5 values:

- **Good** (0-12): Air quality is satisfactory
- **Moderate** (12.1-35.4): Acceptable for most people
- **Unhealthy for Sensitive Groups** (35.5-55.4): Sensitive groups may experience symptoms
- **Unhealthy** (55.5-150.4): Everyone may experience health effects
- **Very Unhealthy** (150.5-250.4): Health alert conditions
- **Hazardous** (250.5+): Emergency conditions

## Database Schema

The `AQI` model stores:

- `id` - Unique identifier
- `pm2_5` - PM2.5 particulate matter (µg/m³)
- `pm10` - PM10 particulate matter (µg/m³)
- `no2` - Nitrogen Dioxide (µg/m³)
- `o3` - Ozone (µg/m³)
- `co` - Carbon Monoxide (mg/m³)
- `so2` - Sulfur Dioxide (µg/m³)
- `nh3` - Ammonia (µg/m³)
- `pb` - Lead (µg/m³)
- `timestamp` - Reading timestamp

## Development

### Project Structure

```
src/
├── controller/         # HTTP request handlers
├── service/           # Business logic
├── repository/        # Data access layer
├── model/            # Data models
├── types/            # TypeScript type definitions
├── prisma/           # Database schema
└── index.ts          # Server entry point
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:reset` - Reset database

## Testing

Example API request to create AQI data:

```bash
curl -X POST http://localhost:3001/api/aqi \
  -H "Content-Type: application/json" \
  -d '{
    "pm2_5": 15.2,
    "pm10": 25.5,
    "no2": 12.1,
    "o3": 45.3,
    "co": 0.8,
    "so2": 8.2,
    "nh3": 3.1,
    "pb": 0.02
  }'
```

## License

ISC

export interface AQI {
    id: number;
    pm2_5?: number;
    pm10?: number;
    no2?: number;
    o3?: number;
    co?: number;
    so2?: number;
    nh3?: number;
    pb?: number;
    timestamp?: Date;
}

export interface CreateAQIRequest {
    pm2_5?: number;
    pm10?: number;
    no2?: number;
    o3?: number;
    co?: number;
    so2?: number;
    nh3?: number;
    pb?: number;
}

export interface AQIResponse {
    id: number;
    pm2_5?: number;
    pm10?: number;
    no2?: number;
    o3?: number;
    co?: number;
    so2?: number;
    nh3?: number;
    pb?: number;
    timestamp: Date;
    level?: string;
}
/**
 * API service for communicating with the IoT Web backend server
 */

import { AQIData, CreateAQIRequest } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class APIService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.request('/health');
    }

    // AQI Data endpoints
    async getAllAQI(): Promise<AQIData[]> {
        return this.request('/api/aqi');
    }

    async getLatestAQI(): Promise<AQIData> {
        return this.request('/api/aqi/latest');
    }

    async getAQIById(id: number): Promise<AQIData> {
        return this.request(`/api/aqi/${id}`);
    }

    async getAQIByDate(date: string): Promise<AQIData[]> {
        return this.request(`/api/aqi/date/${date}`);
    }

    async getAQIByDateRange(startDate: string, endDate: string): Promise<AQIData[]> {
        return this.request(`/api/aqi/range?startDate=${startDate}&endDate=${endDate}`);
    }

    async createAQI(data: CreateAQIRequest): Promise<AQIData> {
        return this.request('/api/aqi', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // MQTT endpoints
    async publishMQTT(topic: string, message: string): Promise<{ success: boolean; message: string }> {
        return this.request('/mqtt/publish', {
            method: 'POST',
            body: JSON.stringify({ topic, message }),
        });
    }

    // Utility methods
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    getAQILevelColor(level?: string): string {
        const colors = {
            'Good': '#00e400',
            'Moderate': '#ffff00',
            'Unhealthy for Sensitive Groups': '#ff7e00',
            'Unhealthy': '#ff0000',
            'Very Unhealthy': '#8f3f97',
            'Hazardous': '#7e0023'
        };

        return colors[level as keyof typeof colors] || '#gray';
    }

    getAQILevelDescription(level?: string): string {
        const descriptions = {
            'Good': 'Air quality is satisfactory and poses little or no risk.',
            'Moderate': 'Air quality is acceptable for most people.',
            'Unhealthy for Sensitive Groups': 'Sensitive groups may experience minor symptoms.',
            'Unhealthy': 'Everyone may begin to experience adverse health effects.',
            'Very Unhealthy': 'Health alert: everyone may experience serious health effects.',
            'Hazardous': 'Health warning: everyone should avoid outdoor activities.'
        };

        return descriptions[level as keyof typeof descriptions] || 'Unknown air quality level.';
    }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;

import { AQIModel } from "../model/aqi_model";
import { AQIRepository } from "../repository/aqi_repository";
import { CreateAQIRequest } from "../types/types";

export class AQIService {
    private aqiRepository: AQIRepository;

    constructor(aqiRepository: AQIRepository) {
        this.aqiRepository = aqiRepository;
    }

    async getAQIById(id: string): Promise<AQIModel | null> {
        try {
            return await this.aqiRepository.get(id);
        } catch (error) {
            console.error('Error fetching AQI by ID:', error);
            throw new Error('Failed to fetch AQI data');
        }
    }

    async getAllAQI(): Promise<AQIModel[] | null> {
        try {
            return await this.aqiRepository.getAll();
        } catch (error) {
            console.error('Error fetching all AQI data:', error);
            throw new Error('Failed to fetch all AQI data');
        }
    }

    async getAQIByDate(date: string): Promise<AQIModel[] | null> {
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date format');
            }
            return await this.aqiRepository.getAllByDate(parsedDate);
        } catch (error) {
            console.error('Error fetching AQI by date:', error);
            throw new Error('Failed to fetch AQI data by date');
        }
    }

    async getAQIByDateRange(startDate: string, endDate: string): Promise<AQIModel[] | null> {
        try {
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);

            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                throw new Error('Invalid date format');
            }

            if (parsedStartDate > parsedEndDate) {
                throw new Error('Start date must be before end date');
            }

            return await this.aqiRepository.getByDateRange(parsedStartDate, parsedEndDate);
        } catch (error) {
            console.error('Error fetching AQI by date range:', error);
            throw new Error('Failed to fetch AQI data by date range');
        }
    }

    calculateAQILevel(aqiData: AQIModel): string {
        // Simple AQI level calculation based on PM2.5 (you can expand this)
        const pm25 = aqiData.pm2_5 || 0;

        if (pm25 <= 12) return 'Good';
        if (pm25 <= 35.4) return 'Moderate';
        if (pm25 <= 55.4) return 'Unhealthy for Sensitive Groups';
        if (pm25 <= 150.4) return 'Unhealthy';
        if (pm25 <= 250.4) return 'Very Unhealthy';
        return 'Hazardous';
    }

    async getLatestAQI(): Promise<AQIModel | null> {
        try {
            const allData = await this.aqiRepository.getAll();
            if (!allData || allData.length === 0) {
                return null;
            }

            // Sort by timestamp descending and get the latest
            return allData.sort((a, b) => {
                const aTime = a.timestamp?.getTime() || 0;
                const bTime = b.timestamp?.getTime() || 0;
                return bTime - aTime;
            })[0];
        } catch (error) {
            console.error('Error fetching latest AQI:', error);
            throw new Error('Failed to fetch latest AQI data');
        }
    }

    async createAQI(aqiData: CreateAQIRequest): Promise<AQIModel> {
        try {
            return await this.aqiRepository.create(aqiData);
        } catch (error) {
            console.error('Error creating AQI data:', error);
            throw new Error('Failed to create AQI data');
        }
    }
}
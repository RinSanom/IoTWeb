import { Request, Response } from 'express';
import { AQIService } from "../service/aqi_service";
import { CreateAQIRequest } from '../types/types';

export class AQIController {
    private aqiService: AQIService;

    constructor(aqiService: AQIService) {
        this.aqiService = aqiService;
    }

    // GET /api/aqi/:id
    async getAQIById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const aqi = await this.aqiService.getAQIById(id);

            if (!aqi) {
                res.status(404).json({ error: 'AQI data not found' });
                return;
            }

            const level = this.aqiService.calculateAQILevel(aqi);
            res.json({ ...aqi, level });
            return;
        } catch (error) {
            console.error('Error in getAQIById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/aqi
    async getAllAQI(req: Request, res: Response): Promise<void> {
        try {
            const aqiData = await this.aqiService.getAllAQI();

            if (!aqiData) {
                res.json([]);
                return;
            }

            const aqiWithLevels = aqiData.map(aqi => ({
                ...aqi,
                level: this.aqiService.calculateAQILevel(aqi)
            }));

            res.json(aqiWithLevels);
        } catch (error) {
            console.error('Error in getAllAQI:', error);
            res.status(500).json({
                error: `Internal server error`,
                message: (error as Error).message || 'An unexpected error occurred'
            });
        }
    }

    // GET /api/aqi/latest
    async getLatestAQI(req: Request, res: Response): Promise<void> {
        try {
            const latestAqi = await this.aqiService.getLatestAQI();

            if (!latestAqi) {
                res.status(404).json({ error: 'No AQI data found' });
                return;
            }

            const level = this.aqiService.calculateAQILevel(latestAqi);
            res.json({ ...latestAqi, level });
        } catch (error) {
            console.error('Error in getLatestAQI:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/aqi/date/:date
    async getAQIByDate(req: Request, res: Response): Promise<void> {
        try {
            const { date } = req.params;
            const aqiData = await this.aqiService.getAQIByDate(date);

            if (!aqiData) {
                res.json([]);
                return;
            }

            const aqiWithLevels = aqiData.map(aqi => ({
                ...aqi,
                level: this.aqiService.calculateAQILevel(aqi)
            }));

            res.json(aqiWithLevels);
        } catch (error) {
            console.error('Error in getAQIByDate:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/aqi/range?startDate=...&endDate=...
    async getAQIByDateRange(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                res.status(400).json({ error: 'Start date and end date are required' });
                return;
            }

            const aqiData = await this.aqiService.getAQIByDateRange(
                startDate as string,
                endDate as string
            );

            if (!aqiData) {
                res.json([]);
                return;
            }

            const aqiWithLevels = aqiData.map(aqi => ({
                ...aqi,
                level: this.aqiService.calculateAQILevel(aqi)
            }));

            res.json(aqiWithLevels);
        } catch (error) {
            console.error('Error in getAQIByDateRange:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/aqi (for adding new AQI data, useful for testing)
    async createAQI(req: Request, res: Response): Promise<void> {
        try {
            const aqiData: CreateAQIRequest = req.body;

            // Validate that at least one measurement is provided
            const hasValidData = Object.values(aqiData).some(value =>
                value !== undefined && value !== null && !isNaN(Number(value))
            );

            if (!hasValidData) {
                res.status(400).json({
                    error: 'At least one valid air quality measurement must be provided',
                    validFields: ['pm2_5', 'pm10', 'no2', 'o3', 'co', 'so2', 'nh3', 'pb']
                });
                return;
            }

            const createdAqi = await this.aqiService.createAQI(aqiData);
            const level = this.aqiService.calculateAQILevel(createdAqi);

            res.status(201).json({ ...createdAqi, level });
        } catch (error) {
            console.error('Error in createAQI:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
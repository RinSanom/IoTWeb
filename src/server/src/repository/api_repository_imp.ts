import { AQIModel } from "../model/aqi_model";
import { PrismaClient } from "../src/generated/prisma";
import { AQIRepository } from "./aqi_repository";
import { CreateAQIRequest } from "../types/types";

export class AQIImp implements AQIRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async get(id: string): Promise<AQIModel | null> {
        const aqi = await this.prisma.aQI.findUnique({
            where: { id: parseInt(id) }
        });

        if (!aqi) return null;

        return new AQIModel({
            id: aqi.id,
            pm2_5: aqi.pm2_5,
            pm10: aqi.pm10,
            no2: aqi.no2,
            o3: aqi.o3,
            co: aqi.co,
            so2: aqi.so2,
            nh3: aqi.nh3,
            pb: aqi.pb,
            timestamp: aqi.timestamp
        });
    }

    async getAll(): Promise<AQIModel[] | null> {
        const aqis = await this.prisma.aQI.findMany({
            orderBy: { timestamp: 'desc' }
        });

        return aqis.map(aqi => new AQIModel({
            id: aqi.id,
            pm2_5: aqi.pm2_5,
            pm10: aqi.pm10,
            no2: aqi.no2,
            o3: aqi.o3,
            co: aqi.co,
            so2: aqi.so2,
            nh3: aqi.nh3,
            pb: aqi.pb,
            timestamp: aqi.timestamp
        }));
    }

    async getAllByDate(date: Date): Promise<AQIModel[] | null> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const aqis = await this.prisma.aQI.findMany({
            where: {
                timestamp: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        return aqis.map(aqi => new AQIModel({
            id: aqi.id,
            pm2_5: aqi.pm2_5,
            pm10: aqi.pm10,
            no2: aqi.no2,
            o3: aqi.o3,
            co: aqi.co,
            so2: aqi.so2,
            nh3: aqi.nh3,
            pb: aqi.pb,
            timestamp: aqi.timestamp
        }));
    }

    async getByDateRange(startDate: Date, endDate: Date): Promise<AQIModel[] | null> {
        const aqis = await this.prisma.aQI.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        return aqis.map(aqi => new AQIModel({
            id: aqi.id,
            pm2_5: aqi.pm2_5,
            pm10: aqi.pm10,
            no2: aqi.no2,
            o3: aqi.o3,
            co: aqi.co,
            so2: aqi.so2,
            nh3: aqi.nh3,
            pb: aqi.pb,
            timestamp: aqi.timestamp
        }));
    }

    async create(aqiData: CreateAQIRequest): Promise<AQIModel> {
        const aqi = await this.prisma.aQI.create({
            data: {
                pm2_5: aqiData.pm2_5 ?? 0,
                pm10: aqiData.pm10 ?? 0,
                no2: aqiData.no2 ?? 0,
                o3: aqiData.o3 ?? 0,
                co: aqiData.co ?? 0,
                so2: aqiData.so2 ?? 0,
                nh3: aqiData.nh3 ?? 0,
                pb: aqiData.pb ?? 0,
                timestamp: new Date()
            }
        });

        return new AQIModel({
            id: aqi.id,
            pm2_5: aqi.pm2_5,
            pm10: aqi.pm10,
            no2: aqi.no2,
            o3: aqi.o3,
            co: aqi.co,
            so2: aqi.so2,
            nh3: aqi.nh3,
            pb: aqi.pb,
            timestamp: aqi.timestamp
        });
    }
}
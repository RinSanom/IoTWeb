import { AQIModel } from "../model/aqi_model";
import { CreateAQIRequest } from "../types/types";

export interface AQIRepository {
    get(id: string): Promise<AQIModel | null>
    getAll(): Promise<AQIModel[] | null>
    getAllByDate(date: Date): Promise<AQIModel[] | null>
    getByDateRange(startDate: Date, endDate: Date): Promise<AQIModel[] | null>
    create(aqiData: CreateAQIRequest): Promise<AQIModel>
}
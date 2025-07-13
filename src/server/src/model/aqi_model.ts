import { AQI } from "../types/types";

export class AQIModel {
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

    constructor({ id, pm2_5, pm10, no2, o3, co, so2, nh3, pb, timestamp }: AQI) {
        this.id = id
        this.co = co
        this.pm2_5 = pm2_5
        this.pm10 = pm10
        this.no2 = no2
        this.o3 = o3
        this.so2 = so2
        this.nh3 = nh3
        this.pb = pb
        this.timestamp = timestamp
    }
}
import { DatabaseManager } from '../DatabaseManager';
import * as Mongoose from 'mongoose';
import { injectable } from 'inversify';
import Logger from 'chk2global/dist/logger/Logger';

@injectable()
export class MongoManager implements DatabaseManager {
    private readonly TAG = this.constructor.name;

    public async connect(url: string, logger?: Logger): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                Mongoose.connection.on('connected', () => this.logInfo("Connected to database.", logger));
                Mongoose.connection.on('disconnected', () => this.logInfo("Disconnected from database.", logger));
                await Mongoose.connect(url, { useNewUrlParser: true,
                    socketTimeoutMS: 0,
                    keepAlive: true,
                    reconnectTries: 100
                });
                resolve();              
            } catch (error) {
                reject(error);
            }
        });
    }

    private logError(message: string, logger: Logger): void {
        if (logger) logger.error(this.TAG, message);
    }

    private logInfo(message: string, logger: Logger): void {
        if (logger) logger.info(this.TAG, message);
    }
}
import { DatabaseManager } from '../DatabaseManager';
import * as Mongoose from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class MongoManager implements DatabaseManager {
    connect(url: string) {
        return Mongoose.connect(url, { useNewUrlParser: true });
    }
}
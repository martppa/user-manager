import Application from 'chk2common/dist/Application';
import { DatabaseManager } from './db/DatabaseManager';
import { Injector } from './di/Injector';
import Server from 'chk2common/dist/server/Server';
import ConfigRequester from 'chk2common/dist/config/ConfigRequester';
import Logger from 'chk2common/dist/logger/Logger';
import ServiceRegister from 'chk2common/dist/registration/ServiceRegister';

export class UserManagerApplication extends Application {
    private databaseManager: DatabaseManager;

    constructor() {
        Injector.initialize();
        super();
        this.databaseManager = this.getDatabaseManager();
    }

    protected async setUpExtras(config: any): Promise<void> {
        this.connectToDatabase(this.config.mongodbUri);
    }

    protected async connectToDatabase(uri: string): Promise<void> {
        try {
            await this.databaseManager.connect(uri);
        } catch (error) {
            return Promise.reject(`Error connecting to database: ${error.message}`);
        }
    }

    protected getServer(): Server {
        return Injector.container.get<Server>(Injector.SERVER.value);
    }

    protected getConfigRequester(): ConfigRequester {
        return Injector.container.get<ConfigRequester>(Injector.CONFIG_REQUESTER.value);
    }

    protected getLogger(): Logger {
        return Injector.container.get<Logger>(Injector.LOGGER.value);
    }

    protected getDatabaseManager(): DatabaseManager {
        return Injector.container.get<DatabaseManager>(Injector.DATABASE_MANAGER.value);
    }

    protected getServiceRegister(): ServiceRegister {
        return Injector.container.get<ServiceRegister>(Injector.SERVICE_REGISTER.value);
    }
}
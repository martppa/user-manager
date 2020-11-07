import { DatabaseManager } from './db/DatabaseManager';
import { Injector } from './di/Injector';
import SessionNotifier from '../business/com/SessionNotifier';
import NetworkController from '../com/controllers/NetworkController';
import Application from '../common/Application';
import Logger from '../global/logger/Logger';
import Server from '../common/server/Server';
import ConfigRequester from '../common/config/ConfigRequester';

export class UserManagerApplication extends Application {
    private databaseManager: DatabaseManager;
    private sessionNotifier: SessionNotifier;
    private eventController: NetworkController;

    constructor() {
        Injector.initialize();
        super();
        this.databaseManager = this.getDatabaseManager();
        this.sessionNotifier = this.getSessionNotifier();
        this.eventController = this.getEventController();
    }

    protected async setUpExtras(config: any): Promise<void> {
        await this.connectToDatabase(config.mongodbUri, this.logger);
        await this.initializeSessionNotifier(config.amqpUri);
        await this.listenToEvents(config.amqpUri);
    }

    protected async connectToDatabase(uri: string, logger?: Logger): Promise<void> {
        try {
            await this.databaseManager.connect(uri, logger);
        } catch (error) {
            throw new Error(`Error connecting to database: ${error.message}`);
        }
    }

    protected async initializeSessionNotifier(uri: string): Promise<void> {
        try {
            await this.sessionNotifier.initialize(uri);
        } catch (error) {
            throw new Error(`Error connecting to AMQP server: ${error.message}`);
        }
    }

    protected async listenToEvents(uri: string): Promise<void> {
        try {
            await this.eventController.initialize(uri);
        } catch (error) {
            throw new Error(`Error listening to events: ${error.message}`);
        }
    }

    protected getServer(): Server {
        return Injector.get<Server>(Injector.SERVER.value);
    }

    protected getConfigRequester(): ConfigRequester {
        return Injector.get<ConfigRequester>(Injector.CONFIG_REQUESTER.value);
    }

    protected getLogger(): Logger {
        return Injector.get<Logger>(Injector.LOGGER.value);
    }
 
    protected getDatabaseManager(): DatabaseManager {
        return Injector.get<DatabaseManager>(Injector.DATABASE_MANAGER.value);
    }

    protected getSessionNotifier(): SessionNotifier {
        return Injector.get<SessionNotifier>(Injector.SESSION_NOTIFIER);
    }

    protected getEventController(): NetworkController {
        return Injector.get<NetworkController>(Injector.EVENT_CONTROLLER);
    }
}
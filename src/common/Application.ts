import Logger from '../global/logger/Logger';
import ConfigRequester from './config/ConfigRequester';
import IServer from './server/Server';

export default abstract class Application {
    protected readonly SERVER_MESSAGE = "Server started at port:";
    protected readonly TAG: string = this.constructor.name;

    protected server: IServer;
    protected logger: Logger;
    protected configRequester: ConfigRequester;
    protected config: any;

    public constructor() {
        this.server = this.getServer();
        this.configRequester = this.getConfigRequester();
        this.logger = this.getLogger();
    }

    public async init() {
        try {
            this.config = await this.requestConfig();
            if (!this.config) {
                throw new Error("No configuration was provided.");
            }
            await this.setUpExtras(this.config);
            await this.startServer(this.config.port);
            this.logger.info(this.TAG, `Server started at: ${this.config.port}`);
        } catch (error) {
            this.logger.error(this.TAG, `Error initializing the server:`, error);
            process.exit(1);
        }          
    }

    protected abstract getServer(): IServer;
    protected abstract getConfigRequester(): ConfigRequester;
    protected abstract getLogger(): Logger
    protected abstract async setUpExtras(config: any): Promise<void>;

    protected async requestConfig(): Promise<any> {
        return await this.configRequester.requestConfig();
    }

    protected async startServer(port: number): Promise<void> {
        await this.server.listen(port);
    }
}
import ConfigRequester from "chk2common/dist/config/ConfigRequester";
import { injectable } from "inversify";

@injectable()
export default class EnvConfigRequester implements ConfigRequester {
    
    public requestConfig(): Promise<any> {
        return Promise.resolve({
            mongodbUri: process.env.MONGO_DATABASE_URL,
            port: process.env.PORT,
            amqpUri: process.env.BROKER_SERVER_URL
        });
    }
}
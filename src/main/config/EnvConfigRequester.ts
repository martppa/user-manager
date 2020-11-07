import { injectable } from "inversify";
import ConfigRequester from "../../common/config/ConfigRequester";

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
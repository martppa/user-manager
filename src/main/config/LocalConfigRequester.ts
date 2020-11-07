import { injectable } from "inversify";
import ConfigRequester from "../../common/config/ConfigRequester";

@injectable()
export default class LocalConfigRequester implements ConfigRequester {
    
    public requestConfig(): Promise<any> {
        return Promise.resolve({
            mongodbUri: "mongodb://localhost:27017/users",
            port: 3000
        });
    }
}
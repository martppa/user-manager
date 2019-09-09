
import ConfigRequester from "chk2common/dist/config/ConfigRequester";
import { injectable } from "inversify";

@injectable()
export default class LocalConfigRequester implements ConfigRequester {
    
    public requestConfig(): Promise<any> {
        return Promise.resolve({
            mongodbUri: "mongodb://localhost:27017/user",
            port: 2425
        });
    }
}
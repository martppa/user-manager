import Logger from "../../global/logger/Logger";

export interface DatabaseManager {
    connect(url: string, logger?: Logger);
}
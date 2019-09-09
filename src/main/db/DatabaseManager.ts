import Logger from "chk2global/dist/logger/Logger";

export interface DatabaseManager {
    connect(url: string, logger?: Logger);
}
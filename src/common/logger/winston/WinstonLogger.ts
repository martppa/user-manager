import Winston = require("winston");
import { injectable } from 'inversify';
import BuildEnvironment from "../../env/BuildEnvironment";
import Logger from "../../../global/logger/Logger";

@injectable()
export default class WinstonLogger implements Logger {
    private static readonly DEBUG_LEVEl = 'debug';

    private transportFile: any;
    private logOutput: any;
    private appName: string;
    private buildType: string;

    public constructor() {
        this.appName = global['app-name'];
        const logFormat = Winston.format.combine(Winston.format.timestamp(), Winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        }));
        this.logOutput = new Winston.transports.Console({
            format: logFormat
        });
        Winston.add(this.logOutput);
        if (BuildEnvironment.getBuildType() === BuildEnvironment.BUILD_DEBUG) {
            Winston.level = WinstonLogger.DEBUG_LEVEl;
        }
    }

    public info(tag: string, message: string): void {
        Winston.info(`${this.appName} => ${tag} - ${message}`);
    }

    public warn(tag: string, message: string): void {
        Winston.warn(`${this.appName} => ${tag} - ${message}`);
    }

    public error(tag: string, message: string, error: Error): void {
        let errorMessage = "";
        if (error) {
            if (Winston.level === WinstonLogger.DEBUG_LEVEl) {
                errorMessage = error.stack;
            } else {
                errorMessage = error.message;
            }
        }
        Winston.error(`${this.appName} => ${tag} - ${message} ${errorMessage}`);
    }

    public debug(tag: string, message: string): void {
        Winston.debug(`${this.appName} => ${tag} - ${message}`);
    }
}
import { ServerWrapper } from './../ServerWrapper';
import * as express from 'express';
import * as path from 'path';
import * as Router from 'routing-controllers';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

import Server from '../Server';
import { injectable } from 'inversify';
import BuildEnvironment from '../../env/BuildEnvironment';

const header = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};

const errorHandler = (err, req, res, next) => {
    if (err) {
        if (err.stack) console.error(err.stack);
        return res.status(500).send(JSON.stringify({ "status": 1, "errors": [ err.message ] }));
    }
}

@injectable()
export default class ExpressServer implements Server, ServerWrapper {
    private express: express.Express;

    constructor() {
        this.express = this.createServer();
        this.express.use(logger(BuildEnvironment.getBuildType()));
        this.express.use(bodyParser.json);
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(header);
        this.express.use(errorHandler);
    }

    public listen(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.express.listen(port, (error: any) => {
                if (error) {
                    reject(error);   
                }    
                resolve();
            });
        });
    }

    public getExpressServer(): express.Express {
        return this.express;
    }

    public getWrappedServer(): any {
        return this.express;
    }

    private createServer(): express.Express {
        const controllersPath = path.resolve('dist', 'api', 'controllers');
        return Router.createExpressServer({
            cors: true,
            controllers: [controllersPath + "/*.js"]
        });
    }
}
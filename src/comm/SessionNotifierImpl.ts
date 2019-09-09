import SessionNotifier from '../business/comm/SessionNotifier';
import { Observable, from, Subscriber } from 'rxjs';
import { injectable, inject } from 'inversify';
import SessionEmitter from 'chk2session-bridge/dist/SessionEmitter';
import SessionBroadcaster from 'chk2session-bridge/dist/SessionBroadcaster';
import SessionBroadcasterPod from 'chk2session-bridge/dist/SessionBroadcastPod';
import Logger from 'chk2global/dist/logger/Logger';
import { BusinessInjector } from '../business/di/BusinessInjector';

@injectable()
export default class SessionNotifierImpl implements SessionNotifier {
    private readonly TAG = this.constructor.name;

    private sessionEmitter: SessionEmitter;
    private sessionBroadcasterPod: SessionBroadcasterPod;

    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    public constructor() {
        this.sessionEmitter = new SessionBroadcaster();
        this.sessionBroadcasterPod = new SessionBroadcasterPod();
    }
    
    /* Can't use 'from' operator because the promise will emit an undefined value and will
        make the observable to behave unpredictably */

    public async initialize(uri: string): Promise<void> {
        this.sessionEmitter.setLogger(this.logger);
        this.sessionBroadcasterPod.setLogger(this.logger);
        await this.sessionEmitter.initialize(uri);
        await this.sessionBroadcasterPod.initialize(uri);
    }

    public notifyLogout(token: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                await this.sessionEmitter.notifyLogout(token);
                subscriber.complete();
            } catch(error) {
                subscriber.error(error);
            }
        });
    }
    
    public notifyRefresh(oldToken: string, newToken: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                await this.sessionEmitter.notifyRefresh(oldToken, newToken);
                subscriber.complete();
            } catch(error) {
                subscriber.error(error);
            }
        });
    }

    public notifyLogin(token: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                await this.sessionEmitter.notifyLogin(token);
                subscriber.complete();
            } catch(error) {
                subscriber.error(error);
            }
        });
    }
}
import SessionNotifier from '../business/com/SessionNotifier';
import { Observable, from, Subscriber } from 'rxjs';
import { injectable, inject } from 'inversify';
import { BusinessInjector } from '../business/di/BusinessInjector';
import Logger from '../global/logger/Logger';

@injectable()
export default class SessionNotifierImpl implements SessionNotifier {
    private readonly TAG = this.constructor.name;


    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    // Inject our session emitter via Kafka, AMQP or any message broker you prefer

    public constructor() {
        
    }

    public async initialize(uri: string): Promise<void> {
        // Initialize your emitter
    }

    public notifyLogout(token: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                // emit session to other services
                subscriber.next(void 0);
                subscriber.complete();
            } catch(error) {
                subscriber.error(error);
            }
        });
    }
    
    public notifyRefresh(oldToken: string, newToken: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                // notify session refresh
                subscriber.next(void 0);
                subscriber.complete();
            } catch(error) {
                subscriber.error(error);
            }
        });
    }

    public notifyLogin(token: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                // notify login
                subscriber.next(void 0);
                subscriber.complete();
            } catch(error) {
                subscriber.error(error);
            }
        });
    }
}
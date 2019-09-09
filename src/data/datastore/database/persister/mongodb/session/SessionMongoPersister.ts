import SessionPersister from '../../SessionPersister';
import { Observable, Subscriber } from 'rxjs';
import Errors from '../../../../../../business/constants/Errors';
import { BusinessInjector } from '../../../../../../business/di/BusinessInjector';
import { inject, injectable } from 'inversify';
import Logger from 'chk2global/dist/logger/Logger';
import SessionSchemaMapper from '../../../../../entities/mappers/SessionSchemaMapper';
import { SessionSchema, SessionSchemaField } from '../../../../../entities/SessionSchema';
import SessionEntity from '../../../../../entities/SessionEntity';

@injectable()
export default class SessionMongoPersister implements SessionPersister {
    private readonly TAG: string = this.constructor.name;

    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;
    
    public saveSession(sessionEntity: SessionEntity): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            const sessionSchema = SessionSchemaMapper.mapToSchema(sessionEntity);
            try {
                await sessionSchema.save();
                subscriber.complete();                
            } catch (error) {
                this.logger.error(this.TAG, `Error when saving session: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }

    public removeSessionByToken(token: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            try {
                await SessionSchema.deleteMany({ token: token });
                subscriber.complete();
            } catch (error) {
                this.logger.error(this.TAG, `Error when removing session by token from database: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
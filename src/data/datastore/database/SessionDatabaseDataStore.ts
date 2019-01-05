import SessionDataStore from '../SessionDataStore';
import { inject, injectable } from 'inversify';
import SessionPersister from './persister/SessionPersister';
import { BusinessInjector } from '../../../business/di/BusinessInjector';
import { Observable } from 'rxjs';
import SessionEntity from '../../entities/SessionEntity';

@injectable()
export default class SessionDatabaseDataStore implements SessionDataStore {
    @inject(BusinessInjector.SESSION_PERSISTER.value)
    private sessionPersister: SessionPersister;

    public saveSession(sessionEntity: SessionEntity): Observable<any> {
        return this.sessionPersister.saveSession(sessionEntity);
    }
    
    public removeSessionByToken(token: string): Observable<any> {
        return this.sessionPersister.removeSessionByToken(token);
    }
}
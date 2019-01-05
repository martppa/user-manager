import SessionDataSource from '../datasource/SessionDataSource';
import { SessionRepository } from '../../business/repositories/SessionRepository';
import { Observable } from 'rxjs';
import Session from '../../business/models/Session';
import { map } from 'rxjs/operators';
import SessionEntityMapper from '../entities/mappers/SessionEntityMapper';
import { inject, injectable } from 'inversify';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import SessionDataStore from '../datastore/SessionDataStore';

@injectable()
export default class SessionRepositoryImpl implements SessionRepository {
    @inject(BusinessInjector.SESSION_DATASOURCE.value)
    private sessionDataSource: SessionDataSource;

    @inject(BusinessInjector.SESSION_DATASTORE.value)
    private sessionDataStore: SessionDataStore;

    public getSessionsByUserId(userId: string): Observable<Session[]> {
        return this.sessionDataSource.getSessionsByUserId(userId)
            .pipe(map(sessions => SessionEntityMapper.mapToModels(sessions)));
    }

    public saveSession(session: Session): Observable<any> {
        return this.sessionDataStore.saveSession(SessionEntityMapper.mapToEntity(session));
    }

    public removeSessionByToken(token: string): Observable<any> {
        return this.sessionDataStore.removeSessionByToken(token);
    }
}
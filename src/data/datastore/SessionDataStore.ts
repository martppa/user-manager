import { Observable } from "rxjs";
import SessionEntity from '../entities/SessionEntity';

export default interface SessionDataStore {
    saveSession(sessionEntity: SessionEntity): Observable<any>;
    removeSessionByToken(token: string): Observable<any>;
}
import { Observable } from "rxjs";
import SessionEntity from '../../../entities/SessionEntity';

export default interface SessionPersister {
    saveSession(sessionEntity: SessionEntity): Observable<any>;
    removeSessionByToken(token: string): Observable<any>;
}
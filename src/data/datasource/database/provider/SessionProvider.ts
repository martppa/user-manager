import SessionEntity from '../../../entities/SessionEntity';
import { Observable } from 'rxjs';

export default interface SessionProvider {
    getSessionsByUserId(userId: string): Observable<SessionEntity[]>;
}
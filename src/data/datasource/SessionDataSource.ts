import SessionEntity from '../entities/SessionEntity';
import { Observable } from 'rxjs';

export default interface SessionDataSource {
    getSessionsByUserId(userId: string): Observable<SessionEntity[]>;
}
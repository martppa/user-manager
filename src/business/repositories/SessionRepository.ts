import Session from "../models/Session";
import { Observable } from "rxjs";

export interface SessionRepository {
    getSessionsByUserId(userId: string): Observable<Session[]>;
    saveSession(session: Session): Observable<any>;
    removeSessionByToken(token: string): Observable<any>;
}
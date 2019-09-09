import { Observable } from "rxjs";

export default interface SessionNotifier {
    initialize(uri: string): Promise<void>;
    notifyLogin(token: string): Observable<any>;
    notifyLogout(token: string): Observable<any>;
    notifyRefresh(oldToken: string, newToken: string): Observable<any>;
}
import { Observable } from 'rxjs';

export default interface UserPersister {
    saveUser(username: string, email: string, password: string): Observable<any>;
}
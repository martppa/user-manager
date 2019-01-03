import UserEntity from '../entities/UserEntity';
import { Observable } from 'rxjs';

export default interface UserDataStore {
    saveUser(username: string, email: string, password: string): Observable<any>;
}
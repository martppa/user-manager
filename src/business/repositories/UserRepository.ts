import User from '../models/User';
import { Observable } from 'rxjs';

export default interface UserRepository {
    registerUser(username: string, email: string, password: string): Observable<any>;
    getUserByName(name: string): Observable<User>;
    getUserById(id: string): Observable<User>;
}
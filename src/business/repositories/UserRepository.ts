import User from '../models/User';
import { Observable } from 'rxjs';

export default interface UserRepository {
    registerUser(username: string, email: string, password: string): Observable<any>;
    getUserBy(name: string, email?: string): Observable<User>;
    getUserById(id: string): Observable<User>;
    getUsers(): Observable<User[]>;
    usersExist(userIds: string[]): Observable<boolean>;
}
import UserEntity from '../entities/UserEntity';
import { Observable } from 'rxjs';

export default interface UserDataSource {
    getUserBy(name: string, email?: string): Observable<UserEntity>;
    getUserById(id: string): Observable<UserEntity>;
    usersExit(userIds: string[]): Observable<boolean>;
    getUsers(): Observable<UserEntity[]>;
}
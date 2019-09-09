import { Observable } from "rxjs";
import UserEntity from '../../../entities/UserEntity';

export default interface UserProvider {
    getUserBy(name: string, email?: string): Observable<UserEntity>;
    getUserById(id: string): Observable<UserEntity>;
    usersExist(userIds: string[]): Observable<boolean>;
    getUsers(): Observable<UserEntity[]>;
}

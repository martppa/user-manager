import UserEntity from '../entities/UserEntity';
import { Observable } from 'rxjs';

export default interface UserDataSource {
    getUserByName(name: string): Observable<UserEntity>;
    getUserById(id: string): Observable<UserEntity>;
}
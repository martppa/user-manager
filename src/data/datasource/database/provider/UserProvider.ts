import { Observable } from "rxjs";
import UserEntity from '../../../entities/UserEntity';

export default interface UserProvider {
    getUserByName(name: string): Observable<UserEntity>;
    getUserById(id: string): Observable<UserEntity>;
}

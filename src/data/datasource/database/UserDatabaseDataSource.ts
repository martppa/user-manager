import UserDataSource from "../UserDataSource";
import { Observable } from 'rxjs';
import UserEntity from '../../entities/UserEntity';
import { injectable, inject } from "inversify";
import { BusinessInjector } from '../../../business/di/BusinessInjector';
import UserProvider from './provider/UserProvider';

@injectable()
export default class UserDatabaseDataSource implements UserDataSource {
  
    @inject(BusinessInjector.USER_PROVIDER.value)
    private userProvider: UserProvider;

    public getUserBy(name: string, email?: string): Observable<UserEntity> {
        return this.userProvider.getUserBy(name, email);
    }

    public getUserById(id: string): Observable<UserEntity> {
        return this.userProvider.getUserById(id);
    }

    public usersExit(userIds: string[]): Observable<boolean> {
        return this.userProvider.usersExist(userIds);
    }

    public getUsers(): Observable<UserEntity[]> {
        return this.userProvider.getUsers();
    }
}
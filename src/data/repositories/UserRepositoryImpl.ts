import UserRepository from '../../business/repositories/UserRepository';
import User from '../../business/models/User';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators'
import UserDataStore from '../datastore/UserDataStore';
import UserEntityMapper from '../entities/mappers/UserEntityMapper';
import { injectable, inject } from 'inversify';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import UserDataSource from '../datasource/UserDataSource';

@injectable()
export class UserRepositoryImpl implements UserRepository {    
    @inject(BusinessInjector.USER_DATA_STORE.value)
    private userDataStore: UserDataStore;

    @inject(BusinessInjector.USER_DATA_SOURCE.value)
    private userDataSource: UserDataSource;

    public registerUser(username: string, email: string, password: string): Observable<any> {
        return this.userDataStore.saveUser(username, email, password);
    }

    public getUserBy(name: string, email?: string): Observable<User> {
        return this.userDataSource.getUserBy(name, email).pipe(map(user => UserEntityMapper.mapToModel(user)));
    }

    public getUserById(id: string): Observable<User> {
        return this.userDataSource.getUserById(id).pipe(map(user => UserEntityMapper.mapToModel(user)));
    }
}
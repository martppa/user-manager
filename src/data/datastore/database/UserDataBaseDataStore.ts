import UserDataStore from '../UserDataStore';
import { Observable } from 'rxjs';
import { injectable, inject } from 'inversify';
import { BusinessInjector } from '../../../business/di/BusinessInjector';
import UserPersister from './persister/UserPersister';

@injectable()
export default class UserDataBaseDataStore implements UserDataStore {    
    @inject(BusinessInjector.USER_PERSISTER.value)
    private userDataPersister: UserPersister;

    public saveUser(username: string, email: string, password: string): Observable<any> {
        return this.userDataPersister.saveUser(username, email, password);
    }
}
import { UseCase } from './UseCase';
import UserRepository from '../repositories/UserRepository';
import { inject } from 'inversify';
import { BusinessInjector } from '../di/BusinessInjector';
import { Observable } from 'rxjs';

export default class UsersExist extends UseCase<UsersExistParams, boolean> {
    
    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    protected buildUseCaseObservable(params: UsersExistParams): Observable<boolean> {
        return this.userRepository.usersExist(params.userIds);
    }
}

export class UsersExistParams {
    private constructor(private _userids: string[]) {}

    public static forUserIds(userids: string[]): UsersExistParams {
        return new UsersExistParams(userids);
    }

    public get userIds(): string[] {
        return this._userids;
    }
}
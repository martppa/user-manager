import { UseCase } from './UseCase';
import UserRepository from '../repositories/UserRepository';
import { inject } from 'inversify';
import { BusinessInjector } from '../di/BusinessInjector';
import { Observable, of } from 'rxjs';
import User from '../models/User';
import { flatMap } from 'rxjs/operators';
import Errors from '../constants/Errors';

export class GetUser extends UseCase<GetUserParams, User> {
    
    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    protected buildUseCaseObservable(params: GetUserParams): Observable<User> {
        return this.userRepository.getUserById(params.getUserId())
            .pipe(flatMap(user => {
                if (!user) {
                    throw new Error(Errors.USER_DOESNT_EXIST);
                }
                return of(user)
            }));
    }
}

export class GetUserParams {
    private constructor(private userId: string) {}

    public static forUserId(userId: string): GetUserParams {
        return new GetUserParams(userId);
    }

    public getUserId(): string {
        return this.userId;
    }
}
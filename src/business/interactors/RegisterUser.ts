import { injectable, inject } from 'inversify';
import { UseCase } from './UseCase';
import { Observable, from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import { BusinessInjector } from '../di/BusinessInjector';
import Errors from '../constants/Errors';
import { Cypher } from '../security/Cypher';

@injectable()
export class RegisterUser extends UseCase<RegisterUserParams, any> {
    
    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    @inject(BusinessInjector.CYPHER.value)
    private cypher: Cypher;

    protected buildUseCaseObservable(params: RegisterUserParams): Observable<any> {
        return this.userRepository.getUserByName(params.username)
            .pipe(flatMap(storedUser => {
                if (storedUser) {
                    throw new Error(Errors.USER_ALREADY_EXISTS);
                }
                return from(this.cypher.encrypt(params.password)).pipe(map(hash => ({ hash, params })));
            }))
            .pipe(flatMap(({ hash, params }) => {
                return this.userRepository.registerUser(params.username, params.email, hash);
            }));
    }
}

export class RegisterUserParams {
    private constructor(private _name: string,
        private _email: string,
        private _password: string) {}

    public static forData(username: string, email: string, password: string): RegisterUserParams {
        return new RegisterUserParams(username, email, password);
    }

    public get username(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }
}
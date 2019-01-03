import { inject, injectable } from "inversify";
import { BusinessInjector } from "../di/BusinessInjector";
import UserRepository from "../repositories/UserRepository";
import { Cypher } from "../security/Cypher";
import { UseCase } from "./UseCase";
import Session from '../models/Session';
import { Observable, from, Subscriber, of } from 'rxjs';
import { flatMap, map } from "rxjs/operators";
import Errors from "../constants/Errors";
import User from "../models/User";
import Tokener from "../security/Tokener";
import Tokens from '../constants/Tokens';
import { SessionHandlerUseCase } from './SessionHandlerUseCase';

@injectable()
export class LoginUser extends SessionHandlerUseCase<LoginUserParams> {
    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    @inject(BusinessInjector.CYPHER.value)
    private cypher: Cypher;

    protected buildUseCaseObservable(params: LoginUserParams): Observable<Session> {
        return this.userRepository.getUserByName(params.getUsername())
            .pipe(flatMap(storedUser => {
                if (!storedUser) {
                    throw new Error(Errors.USER_DOESNT_EXIST);
                }
                return from(this.cypher.compare(params.getPassword(), storedUser.password))
                    .pipe(map(match => ({ match, storedUser })));
            }))
            .pipe(flatMap(({ match, storedUser }) => {
                if (!match) {
                    throw new Error(Errors.WRONG_PASSWORD);
                }                
                return of(this.createSession(storedUser.id));
            }));
    }
}

export class LoginUserParams {
    private constructor(private username: string, private password: string) {};

    public static forData(username: string, password: string): LoginUserParams {
        return new LoginUserParams(username, password);
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }
}
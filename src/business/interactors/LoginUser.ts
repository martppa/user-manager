import { inject, injectable } from "inversify";
import { BusinessInjector } from "../di/BusinessInjector";
import UserRepository from "../repositories/UserRepository";
import { Cypher } from "../security/Cypher";
import Session from '../models/Session';
import { Observable, from, Subscriber, of } from 'rxjs';
import { flatMap, map, concat } from "rxjs/operators";
import Errors from "../constants/Errors";
import { SessionHandlerUseCase } from './SessionHandlerUseCase';
import { SessionRepository } from '../repositories/SessionRepository';

@injectable()
export class LoginUser extends SessionHandlerUseCase<LoginUserParams> {
    @inject(BusinessInjector.SESSION_REPOSITORY.value)
    private sessionRepository: SessionRepository;

    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    @inject(BusinessInjector.CYPHER.value)
    private cypher: Cypher;

    protected buildUseCaseObservable(params: LoginUserParams): Observable<Session> {
        return this.userRepository.getUserBy(params.getUsername())
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
                return from(this.createSession(storedUser.id));
            }))
            .pipe(flatMap(session => this.saveSession(session)
            //TODO: Broadcast token to other services
            .pipe(concat(of(session)))));
    }

    private saveSession(session: Session): Observable<any> {
        return this.sessionRepository.saveSession(session);
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
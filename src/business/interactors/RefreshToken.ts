import { injectable, inject } from 'inversify';
import { BusinessInjector } from '../di/BusinessInjector';
import Tokener from '../security/Tokener';
import Session from '../models/Session';
import { Observable, from, of, Subscriber } from 'rxjs';
import UserRepository from '../repositories/UserRepository';
import Environment from '../environment/Environment';
import { flatMap, map, concat, catchError } from 'rxjs/operators';
import Errors from '../constants/Errors';
import { SessionHandlerUseCase } from './SessionHandlerUseCase';
import Tokens from '../constants/Tokens';
import { SessionRepository } from '../repositories/SessionRepository';
import User from '../models/User';

@injectable()
export class RefreshToken extends SessionHandlerUseCase<RefreshTokenParams> {
    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    @inject(BusinessInjector.SESSION_REPOSITORY.value)
    private sessionRepository: SessionRepository;

    public buildUseCaseObservable(params: RefreshTokenParams): Observable<Session> {
        return this.validateToken(params.getRefreshToken())
            .pipe(flatMap(decodedToken => this.getUserById(decodedToken.id).pipe(map(storedUser => ({ storedUser, decodedToken })))))
            .pipe(flatMap(({ storedUser, decodedToken}) => {
                this.validateStoredUser(storedUser);
                this.validateDecodedToken(decodedToken);
                return this.getSessionsByUserId(decodedToken.id).pipe(map(savedSessions => ({ savedSessions, storedUser })));
            }))
            .pipe(flatMap(({ savedSessions, storedUser }) => {
                const oldSession = this.getSessionFromToken(savedSessions, params.getRefreshToken());
                return from(this.createSession(storedUser.id)).pipe(map(newSession => ({ newSession, oldSession })));
            }))
            .pipe(flatMap(({ newSession, oldSession }) => {
                return this.sessionRepository.removeSessionByToken(oldSession.token)
                .pipe(concat(this.sessionRepository.saveSession(newSession)))
                .pipe(concat(of(newSession)));
            }));
    }

    private validateToken(token: string): Observable<any> {
        return from(this.tokener.verify(token, Environment.JWT_KEY))
            .pipe(catchError(error => { 
                throw new Error(Errors.INVALID_TOKEN); 
            }));
    }

    private getUserById(userId: string): Observable<User> {
        return this.userRepository.getUserById(userId);
    }

    private validateStoredUser(storedUser: any): void {
        if (!storedUser) {
            throw new Error(Errors.USER_DOESNT_EXIST);
        }
    }

    private validateDecodedToken(decodedToken: any) {
        if (!decodedToken || decodedToken.type != Tokens.TOKEN_TYPE_REFRESH) {
            throw new Error(Errors.INVALID_TOKEN);
        }
    }

    private getSessionsByUserId(id: string): Observable<Session[]> {
        return this.sessionRepository.getSessionsByUserId(id);
    }

    private getSessionFromToken(sessions: Session[], token: string): Session {
        var oldSession = undefined;
        sessions.forEach(session => {
            if (session.refreshToken === token) {
                oldSession = session;
            }
        });
        if (!oldSession) {
            throw new Error(Errors.INVALID_TOKEN);
        }
        return oldSession;
    }
}

export class RefreshTokenParams {
    private constructor(private token: string) {};

    public static forRefreshToken(token: string): RefreshTokenParams {
        return new RefreshTokenParams(token);
    }

    public getRefreshToken(): string {
        return this.token;
    }
}
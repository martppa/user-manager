import { injectable, inject } from 'inversify';
import { BusinessInjector } from '../di/BusinessInjector';
import Tokener from '../security/Tokener';
import Session from '../models/Session';
import { Observable, from, of } from 'rxjs';
import UserRepository from '../repositories/UserRepository';
import Environment from '../environment/Environment';
import { flatMap, map } from 'rxjs/operators';
import Errors from '../constants/Errors';
import { SessionHandlerUseCase } from './SessionHandlerUseCase';
import Tokens from '../constants/Tokens';

@injectable()
export class RefreshToken extends SessionHandlerUseCase<RefreshTokenParams> {
    @inject(BusinessInjector.USER_REPOSITORY.value)
    private userRepository: UserRepository;

    public buildUseCaseObservable(params: RefreshTokenParams): Observable<Session> {
        return of(this.tokener.verify(params.getToken(), Environment.JWT_KEY))
            .pipe(flatMap(decodedToken => this.userRepository.getUserById(decodedToken.id)
                .pipe(map(storedUser => ({ storedUser, decodedToken })))))
            .pipe(flatMap(({ storedUser, decodedToken}) => {
                if (!storedUser) {
                    throw new Error(Errors.USER_DOESNT_EXIST);
                }
                if (!decodedToken || decodedToken.type != Tokens.TOKEN_TYPE_REFRESH) {
                    throw new Error(Errors.INVALID_TOKEN);
                }
                return of(this.createSession(storedUser.id));
            }));
    }
}

export class RefreshTokenParams {
    private constructor(private token: string) {};

    public static forToken(token: string): RefreshTokenParams {
        return new RefreshTokenParams(token);
    }

    public getToken(): string {
        return this.token;
    }
}
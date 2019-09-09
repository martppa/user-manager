import { UseCase } from './UseCase';
import { inject } from 'inversify';
import { BusinessInjector } from '../di/BusinessInjector';
import { SessionRepository } from '../repositories/SessionRepository';
import { Observable } from 'rxjs';
import SessionNotifier from '../comm/SessionNotifier';
import { concat } from 'rxjs/operators';

export class LogoutUser extends UseCase<LogoutUserParams, any> {
    @inject(BusinessInjector.SESSION_REPOSITORY.value)
    private sessionRepository: SessionRepository;

    @inject(BusinessInjector.SESSION_NOTIFIER)
    private sessionNotifier: SessionNotifier;
    
    protected buildUseCaseObservable(params: LogoutUserParams): Observable<any> {
        return this.sessionRepository.removeSessionByToken(params.getToken())
            .pipe(concat(this.sessionNotifier.notifyLogout(params.getToken())));
    }
}

export class LogoutUserParams {
    private constructor(private token: string) {};

    public static forToken(token: string): LogoutUserParams {
        return new LogoutUserParams(token);
    }

    public getToken(): string {
        return this.token;
    }
}
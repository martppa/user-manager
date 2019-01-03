import { BusinessInjector } from '../di/BusinessInjector';
import Session from '../models/Session';
import { UseCase } from './UseCase';
import { inject } from 'inversify';
import Tokener from '../security/Tokener';
import Tokens from '../constants/Tokens';
import Environment from '../environment/Environment';

export abstract class SessionHandlerUseCase<T> extends UseCase<T, Session> {
    private static ONE_HOUR = "1h";
    private static THIRTY_DAYS = "30d";

    @inject(BusinessInjector.TOKENER.value)
    protected tokener: Tokener;
    
    public createSession(userId: string): Session {
        const token = this.tokener.createToken({
            type: Tokens.TOKEN_TYPE_SESSION, id: userId },
            Environment.JWT_KEY, { expiresIn: SessionHandlerUseCase.ONE_HOUR });
        const refreshToken = this.tokener.createToken({
            type: Tokens.TOKEN_TYPE_REFRESH, id: userId },
            Environment.JWT_KEY, { expiresIn: SessionHandlerUseCase.THIRTY_DAYS });
        return new Session(token, refreshToken);
    }
}
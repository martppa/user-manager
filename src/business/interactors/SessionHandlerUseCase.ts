import { BusinessInjector } from '../di/BusinessInjector';
import Session from '../models/Session';
import { UseCase } from './UseCase';
import { inject } from 'inversify';
import Tokener from '../security/Tokener';
import Tokens from '../constants/Tokens';
import Environment from '../env/Environment';

export abstract class SessionHandlerUseCase<T> extends UseCase<T, Session> {
    private static readonly TOKEN_EXPIRACY = "30d";
    private static readonly REFRESH_EXPIRACY = "30d";

    @inject(BusinessInjector.TOKENER.value)
    protected tokener: Tokener;
    
    public async createSession(userId: string, username: string, email: string): Promise<Session> {
        const token = await this.tokener.createToken({
            type: Tokens.TOKEN_TYPE_SESSION, id: userId, username: username, email: email },
            Environment.JWT_KEY, { expiresIn: SessionHandlerUseCase.TOKEN_EXPIRACY });
        const refreshToken = await this.tokener.createToken({
            type: Tokens.TOKEN_TYPE_REFRESH, id: userId },
            Environment.JWT_KEY, { expiresIn: SessionHandlerUseCase.REFRESH_EXPIRACY });
        return new Session(token, refreshToken, userId);
    }
}
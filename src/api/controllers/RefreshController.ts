import { Controller } from './Controller';
import { JsonController, Post, Body, Res } from 'routing-controllers';
import { Injector } from '../../main/di/Injector';
import Logger from 'chk2global/dist/logger/Logger';
import Validator from '../validator/Validator';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import RefreshTokenValidationModel from '../validator/classvalidator/RefreshTokenValidationModel';
import { RefreshToken, RefreshTokenParams } from '../../business/interactors/RefreshToken';
import Session from '../../business/models/Session';
import SessionModelMapper from '../models/mappers/SessionModelMapper';
import Errors from '../../business/constants/Errors';

@JsonController('/user')
export default class LoginController extends Controller {
    private readonly TAG: string = this.constructor.name;
    
    @Post('/refresh')
    public async refresh(@Body() body: any, @Res() res: any) {
        const logger = Injector.get<Logger>(BusinessInjector.LOGGER.value);
        const validator = Injector.get<Validator>(BusinessInjector.VALIDATOR.value);
        const refreshTokenValidationModel = new RefreshTokenValidationModel(body.refreshToken);

        try {
            const errors = await validator.validate(refreshTokenValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponseString(errors));
            }
        } catch (error) {
            logger.error(this.TAG,`Error during refresh token validation: ${error.message}`);
            return res.send(this.createErrorResponseString([Errors.INTERNAL_SERVER_ERROR]));
        }

        const refreshToken = Injector.get<RefreshToken>(BusinessInjector.REFRESH_TOKEN.value);
        refreshToken.execute((session: Session) => {
                const sessionModel = SessionModelMapper.map(session);
                res.send(this.createSucessfulResponseString(sessionModel));
            }, 
            (loginError: Error) => res.send(this.createErrorResponseString([loginError.message])),
            () => {}, 
            RefreshTokenParams.forRefreshToken(refreshTokenValidationModel.refreshToken));
        
        return res;
    }
}
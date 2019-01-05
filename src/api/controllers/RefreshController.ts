import { Controller } from './Controller';
import { JsonController, Post, Body, Res } from 'routing-controllers';
import { Injector } from '../../main/di/Injector';
import Logger from 'chk2common/dist/logger/Logger';
import Validator from '../validator/Validator';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import RefreshTokenValidationModel from '../validator/classvalidator/RefreshTokenValidationModel';
import { RefreshToken, RefreshTokenParams } from '../../business/interactors/RefreshToken';
import Session from '../../business/models/Session';
import SessionModelMapper from '../models/mappers/SessionModelMapper';
import Errors from '../../business/constants/Errors';

@JsonController('/refresh')
export default class LoginController extends Controller {
    
    @Post('/')
    public async refresh(@Body() body: any, @Res() res: any) {
        const logger = Injector.container.get<Logger>(BusinessInjector.LOGGER.value);
        const validator = Injector.container.get<Validator>(BusinessInjector.VALIDATOR.value);
        const refreshTokenValidationModel = new RefreshTokenValidationModel(body.refreshToken);

        try {
            const errors = await validator.validate(refreshTokenValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponse(errors));
            }
        } catch (error) {
            logger.error(`Error during refresh token validation: ${error.message}`);
            return res.send(this.createErrorResponse([Errors.INTERNAL_SERVER_ERROR]));
        }

        const refreshToken = Injector.container.get<RefreshToken>(BusinessInjector.REFRESH_TOKEN.value);
        refreshToken.execute((session: Session) => {
                const sessionModel = SessionModelMapper.map(session);
                res.send(this.createSucessfulResponse(sessionModel));
            }, 
            (loginError: Error) => res.send(this.createErrorResponse([loginError.message])),
            () => {}, 
            RefreshTokenParams.forRefreshToken(refreshTokenValidationModel.refreshToken));
        
        return res;
    }
}
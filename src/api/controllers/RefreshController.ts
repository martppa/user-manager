import { JsonController, Post, Body, Res } from 'routing-controllers';
import { Injector } from '../../main/di/Injector';
import Validator from '../validator/Validator';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import RefreshTokenValidationModel from '../validator/classvalidator/RefreshTokenValidationModel';
import { RefreshToken, RefreshTokenParams } from '../../business/interactors/RefreshToken';
import Session from '../../business/models/Session';
import SessionModelMapper from '../models/mappers/SessionModelMapper';
import ParserController from '../../common/controllers/ParserController';
import Logger from '../../global/logger/Logger';

@JsonController('/user')
export default class LoginController extends ParserController {
    private readonly TAG: string = this.constructor.name;

    private logger: Logger;
    private validator: Validator;
    private refreshToken: RefreshToken;

    public constructor() {
        super();
        this.logger = Injector.get(BusinessInjector.LOGGER.value);
        this.validator = Injector.get(BusinessInjector.VALIDATOR.value);
        this.refreshToken = Injector.get(BusinessInjector.REFRESH_TOKEN.value);
    }
    
    @Post('/refresh')
    public async refresh(@Body() body: any, @Res() res: any) {
        
        const refreshTokenValidationModel = new RefreshTokenValidationModel(body.refreshToken);

        try {
            const errors = await this.validator.validate(refreshTokenValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponseString(errors));
            }
            const newSession = await this.refreshToken
                .asPromise(RefreshTokenParams.forRefreshToken(refreshTokenValidationModel.refreshToken));
            res.send(this.createSucessfulResponseString(SessionModelMapper.map(newSession)));            
        } catch (error) {
            this.logger.error(this.TAG,`Error during token refresh: ${error.message}`);
            res.status(this.extractErrorCode(error.message)).send(this.createErrorResponseString([error.message]));
        }

        return res;
    }
}
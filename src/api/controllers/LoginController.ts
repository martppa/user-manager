import { Controller } from "./Controller";
import { JsonController, Post, Body, Res } from "routing-controllers";
import LoginDataValidationModel from '../validator/classvalidator/LoginDataValidationModel';
import { Injector } from "../../main/di/Injector";
import { LoginUser, LoginUserParams } from '../../business/interactors/LoginUser';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import Session from "../../business/models/Session";
import SessionModelMapper from '../models/mappers/SessionModelMapper';
import Validator from '../validator/Validator';
import Logger from 'chk2common/dist/logger/Logger';
import Errors from "../../business/constants/Errors";

@JsonController('/signin')
export default class LoginController extends Controller {
    
    @Post('/')
    public async login(@Body() body: any, @Res() res: any) {
        const logger = Injector.container.get<Logger>(BusinessInjector.LOGGER.value);
        const validator = Injector.container.get<Validator>(BusinessInjector.VALIDATOR.value);
        const loginDataValidationModel = new LoginDataValidationModel(body.username, body.password);

        try {
            const errors = await validator.validate(loginDataValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponse(errors));
            }
        } catch (error) {
            logger.error(`Error when validating login data: ${error.message}`);
            return res.send(this.createErrorResponse([Errors.INTERNAL_SERVER_ERROR]));
        }

        const loginUser = Injector.container.get<LoginUser>(BusinessInjector.LOGIN_USER.value);
        loginUser.execute((session: Session) => {
                const sessionModel = SessionModelMapper.map(session);
                res.send(this.createSucessfulResponse(sessionModel));
            }, 
            (loginError: Error) => res.send(this.createErrorResponse([loginError.message])),
            () => {}, 
            LoginUserParams.forData(body.username, body.password));
        
        return res;
    }
}
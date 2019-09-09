import { Controller } from "./Controller";
import { JsonController, Post, Body, Res } from "routing-controllers";
import LoginDataValidationModel from '../validator/classvalidator/LoginDataValidationModel';
import { Injector } from "../../main/di/Injector";
import { LoginUser, LoginUserParams } from '../../business/interactors/LoginUser';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import Session from "../../business/models/Session";
import SessionModelMapper from '../models/mappers/SessionModelMapper';
import Validator from '../validator/Validator';
import Errors from "../../business/constants/Errors";
import Logger from 'chk2global/dist/logger/Logger';

@JsonController('/user')
export default class LoginController extends Controller {
    private readonly TAG: string = this.constructor.name;

    private logger: Logger;
    private validator: Validator;

    public constructor() {
        super();
        this.logger = Injector.get<Logger>(BusinessInjector.LOGGER.value);
        this.validator = Injector.get<Validator>(BusinessInjector.VALIDATOR.value);
    }
    
    @Post('/signin')
    public async login(@Body() body: any, @Res() res: any) {
        const loginDataValidationModel = new LoginDataValidationModel(body.username, body.password);

        try {
            const errors = await this.validator.validate(loginDataValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponseString(errors));
            }
        } catch (error) {
            this.logger.error(this.TAG, `Error during login data validation: ${error.message}`);
            return res.send(this.createErrorResponseString([Errors.INTERNAL_SERVER_ERROR]));
        }

        const loginUser = Injector.get<LoginUser>(BusinessInjector.LOGIN_USER.value);
        loginUser.execute((session: Session) => {
                const sessionModel = SessionModelMapper.map(session);
                res.send(this.createSucessfulResponseString(sessionModel));
            }, 
            (loginError: Error) => res.send(this.createErrorResponseString([loginError.message])),
            () => {}, 
            LoginUserParams.forData(loginDataValidationModel.username, loginDataValidationModel.password));
        
        return res;
    }
}
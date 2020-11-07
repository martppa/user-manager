import { JsonController, Post, Body, Res } from "routing-controllers";
import LoginDataValidationModel from '../validator/classvalidator/LoginDataValidationModel';
import { Injector } from "../../main/di/Injector";
import { LoginUser, LoginUserParams } from '../../business/interactors/LoginUser';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import Validator from '../validator/Validator';
import Errors from "../../business/constants/Errors";
import ParserController from "../../common/controllers/ParserController";
import Logger from "../../global/logger/Logger";
import * as HttpStatus from 'http-status-codes';

@JsonController('/user')
export default class LoginController extends ParserController {
    private readonly TAG: string = this.constructor.name;

    private logger: Logger;
    private validator: Validator;
    private loginUser: LoginUser;

    public constructor() {
        super();
        this.logger = Injector.get(BusinessInjector.LOGGER.value);
        this.validator = Injector.get(BusinessInjector.VALIDATOR.value);
        this.loginUser = Injector.get(BusinessInjector.LOGIN_USER.value);
    }
    
    @Post('/signin')
    public async login(@Body() body: any, @Res() res: any) {
        const loginDataValidationModel = new LoginDataValidationModel(body.username, body.password);

        try {
            const errors = await this.validator.validate(loginDataValidationModel);
            if (errors.length > 0) {
                return res.status(HttpStatus.BAD_REQUEST).send(this.createErrorResponseString(errors));
            }
            const params = LoginUserParams.forData(loginDataValidationModel.username, loginDataValidationModel.password);
            const session = await this.loginUser.asPromise(params);
            res.send(this.createSucessfulResponseString(session));
        } catch (error) {
            this.logger.error(this.TAG, `Error during signin: ${error.message}`);
            res.status(this.extractErrorCode(error.message)).send(this.createErrorResponseString([Errors.INTERNAL_SERVER_ERROR]));
        }

        return res;
    }
}
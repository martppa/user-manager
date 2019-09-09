import { Post, Body, Res, JsonController } from "routing-controllers";
import { Injector } from '../../main/di/Injector';
import { RegisterUser, RegisterUserParams } from '../../business/interactors/RegisterUser';
import UserValidationModel from '../validator/classvalidator/UserValidationModel';
import { Controller } from "./Controller";
import Validator from '../validator/Validator';
import { BusinessInjector } from "../../business/di/BusinessInjector";
import Logger from 'chk2global/dist/logger/Logger';
import Errors from "../../business/constants/Errors";

@JsonController('/user')
export class RegisterController extends Controller {
    private readonly TAG: string = this.constructor.name;

    @Post('/signup')
    public async register(@Body() body: any, @Res() res: any) {
        const logger = Injector.get<Logger>(BusinessInjector.LOGGER.value);
        const validator = Injector.get<Validator>(BusinessInjector.VALIDATOR.value);
        const userValidationModel = new UserValidationModel(body.username, body.email, body.password);       

        try {
            const errors = await validator.validate(userValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponseString(errors));
            }
        } catch (error) {
            logger.error(this.TAG, `Error during user details validation: ${error.message}`);
            return res.send(this.createErrorResponseString([Errors.INTERNAL_SERVER_ERROR]));
        }

        const registerUser = Injector.get<RegisterUser>(BusinessInjector.REGISTER_USER.value);       
        registerUser.execute((next: any) => {},
            (registryError: Error) => res.send(this.createErrorResponseString([registryError.message])),
            () => res.send(this.createEmptySucessfulResponseString()),
            RegisterUserParams.forData(userValidationModel.name, 
                userValidationModel.email, 
                userValidationModel.password));
                    
        return res;
    }    
}
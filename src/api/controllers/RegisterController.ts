import { Post, Body, Res, JsonController } from "routing-controllers";
import { Injector } from '../../main/di/Injector';
import { RegisterUser, RegisterUserParams } from '../../business/interactors/RegisterUser';
import UserValidationModel from '../validator/classvalidator/UserValidationModel';
import { validate } from "class-validator";
import { Controller } from "./Controller";
import Validator from '../validator/Validator';
import { BusinessInjector } from "../../business/di/BusinessInjector";
import Logger from 'chk2common/dist/logger/Logger';

@JsonController('/signup')
export class RegisterController extends Controller {

    @Post('/')
    public async register(@Body() body: any, @Res() res: any) {
        const logger = Injector.container.get<Logger>(BusinessInjector.LOGGER.value);
        const validator = Injector.container.get<Validator>(BusinessInjector.VALIDATOR.value);
        const userValidationModel = new UserValidationModel(body.name, body.email, body.password);        

        try {
            const errors = await validator.validate(userValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponse(errors));
            }
        } catch (error) {
            logger.error(error.message);
        }

        const registerUser = Injector.container.get<RegisterUser>(BusinessInjector.REGISTER_USER.value);        
        registerUser.execute((next: any) => {},
            (registryError: Error) => res.send(this.createErrorResponse([registryError.message])),
            () => res.send(this.createEmptySucessfulResponse()),
            RegisterUserParams.forData(body.name, body.email, body.password));
                    
        return res;
    }
}
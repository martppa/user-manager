import { Post, Body, Res, JsonController } from "routing-controllers";
import { Injector } from '../../main/di/Injector';
import { RegisterUser, RegisterUserParams } from '../../business/interactors/RegisterUser';
import UserValidationModel from '../validator/classvalidator/UserValidationModel';
import Validator from '../validator/Validator';
import { BusinessInjector } from "../../business/di/BusinessInjector";
import Errors from "../../business/constants/Errors";
import Logger from "../../global/logger/Logger";
import ParserController from "../../common/controllers/ParserController";

@JsonController('/user')
export class RegisterController extends ParserController {
    private readonly TAG: string = this.constructor.name;

    private logger: Logger;
    private validator: Validator;
    private registerUser: RegisterUser;

    public constructor() {
        super();
        this.logger = Injector.get<Logger>(BusinessInjector.LOGGER.value);
        this.validator = Injector.get<Validator>(BusinessInjector.VALIDATOR.value);
        this.registerUser = Injector.get<RegisterUser>(BusinessInjector.REGISTER_USER.value);
    }

    @Post('/signup')
    public async register(@Body() body: any, @Res() res: any) {
        
        const userValidationModel = new UserValidationModel(body.username, body.email, body.password);       

        try {
            const errors = await this.validator.validate(userValidationModel);
            if (errors.length > 0) {
                return res.send(this.createErrorResponseString(errors));
            }
            const params = RegisterUserParams.forData(userValidationModel.name, 
                userValidationModel.email, 
                userValidationModel.password);
            await this.registerUser.asPromise(params);
            res.send(this.createEmptySucessfulResponseString());
        } catch (error) {
            this.logger.error(this.TAG, `Error during user registration: ${error.message}`);
            res.status(this.extractErrorCode(error.message)).send(this.createErrorResponseString([Errors.INTERNAL_SERVER_ERROR]));
        }

        return res;
    }    
}
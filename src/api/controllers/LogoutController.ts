import { JsonController, Body, Res, Post } from 'routing-controllers';
import { Injector } from '../../main/di/Injector';
import { LogoutUser, LogoutUserParams } from '../../business/interactors/LogoutUser';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import ParserController from '../../common/controllers/ParserController';
import Logger from '../../global/logger/Logger';

@JsonController('/user')
export default class LogoutController extends ParserController {
    private readonly TAG: string = this.constructor.name;

    private logger: Logger;
    private logoutUser: LogoutUser;

    public constructor() {
        super();
        this.logoutUser = Injector.get(BusinessInjector.LOGOUT_USER.value);
        this.logger = Injector.get(BusinessInjector.LOGGER.value);
    }
    
    @Post('/logout')
    public async refresh(@Body() body: any, @Res() res: any) {
        
        try {
            await this.logoutUser.asPromise(LogoutUserParams.forToken(body.token));
            res.send(this.createEmptySucessfulResponseString());
        } catch (error) {
            this.logger.error(this.TAG, `Error during logout:`, error);
            res.status(this.extractErrorCode(error.message)).send(this.createErrorResponseString([error.message]));
        }        

        return res;
    }
}
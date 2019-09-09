import { Controller } from './Controller';
import { JsonController, Body, Res, Post } from 'routing-controllers';
import { Injector } from '../../main/di/Injector';
import { LogoutUser, LogoutUserParams } from '../../business/interactors/LogoutUser';
import { BusinessInjector } from '../../business/di/BusinessInjector';

@JsonController('/user')
export default class LogoutController extends Controller {
    
    @Post('/logout')
    public async refresh(@Body() body: any, @Res() res: any) {
        const refreshToken = Injector.get<LogoutUser>(BusinessInjector.LOGOUT_USER.value);

        refreshToken.execute(() => {}, 
        (logoutError: Error) => res.send(this.createErrorResponseString([logoutError.message])),
        () => {
            res.send(this.createEmptySucessfulResponseString());
        }, 
        LogoutUserParams.forToken(body.token));

        return res;
    }
}
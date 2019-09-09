import { injectable, inject } from "inversify";
import { BusinessInjector } from '../../business/di/BusinessInjector';
import UsersExist from "../../business/interactors/UsersExist";
import { UsersExistParams } from '../../business/interactors/UsersExist';
import { ResponseWrapper } from "chk2global/dist/network/ResponseWrapper";
import { Controller } from "../../api/controllers/Controller";
import Logger from "chk2global/dist/logger/Logger";
import UserRequestReceiver from "chk2user-bridge/dist/UserRequestReceiver";
import UserRequestReceiverFactory from "chk2user-bridge/dist/factory/UserRequestReceiverFactory";
import { GetUser, GetUserParams } from "../../business/interactors/GetUser";
import UserData from "chk2user-bridge/dist/models/UserData";

@injectable()
export default class NetworkController extends Controller {
    private readonly TAG: string = this.constructor.name;

    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    @inject(BusinessInjector.USERS_EXIST)
    private usersExist: UsersExist;

    @inject(BusinessInjector.GET_USER_USE_CASE)
    private getUserUseCase: GetUser;

    private userRequestReceiver: UserRequestReceiver;

    public constructor() {
        super();
        this.userRequestReceiver = UserRequestReceiverFactory.build();
    }

    public async initialize(uri: string): Promise<void> {
        await this.userRequestReceiver.initialize(uri, this.logger);
        
        await this.userRequestReceiver.receiveUsersExistRequest((userIds: string[], 
            respond: (response: ResponseWrapper) => void) => {
            this.usersExist.execute((doUsersExist: boolean) => {
                respond(this.createSucessfulResponse(doUsersExist));
            }, (error: Error) => {
                respond(this.createErrorResponse([error.message]));
                this.logger.error(this.TAG, `Error by checking if a group of users exist:`, error);
            }, 
            () => {}, 
            UsersExistParams.forUserIds(userIds));
        });

        await this.userRequestReceiver.receiveUsernameRequest(async (userId: string, 
            respond: (response:  ResponseWrapper) => void) => {
            try {
                const user = await this.getUserUseCase.asPromise(GetUserParams.forUserId(userId));
                respond(this.createSucessfulResponse(new UserData(user.id, user.name, user.email)));
            } catch (error) {
                this.logger.error(this.TAG, `Error by retrieving username by id:`, error);
                respond(this.createErrorResponse([error.message]));
            }         
        });
    } 
}
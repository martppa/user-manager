import { injectable, inject } from "inversify";
import { BusinessInjector } from '../../business/di/BusinessInjector';
import UsersExist from "../../business/interactors/UsersExist";
import { UsersExistParams } from '../../business/interactors/UsersExist';
import { GetUser, GetUserParams } from "../../business/interactors/GetUser";
import ParserController from "../../common/controllers/ParserController";
import Logger from "../../global/logger/Logger";
import { ResponseWrapper } from "../../global/network/ResponseWrapper";

@injectable()
export default class NetworkController extends ParserController {
    private readonly TAG: string = this.constructor.name;

    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    @inject(BusinessInjector.USERS_EXIST)
    private usersExist: UsersExist;

    @inject(BusinessInjector.GET_USER_USE_CASE)
    private getUserUseCase: GetUser;

    private networkService: any;

    public constructor() {
        super();
        this.networkService = undefined; // Assign your network service
    }

    public async initialize(uri: string): Promise<void> {
        // await this.networkService.initialize(uri, this.logger); // Commented because networkService is undefined
        await this.handleUserExistsRequest();
        await this.handleUsernameRequest();
    }

    private async handleUserExistsRequest(): Promise<void> {
        return; // Placed here to avoid crash since networkService is undefined 
        await this.networkService.receiveUsersExistRequest(async (userIds: string[], respond: (response: ResponseWrapper) => void) => {
            try {
                const exist = await this.usersExist.asPromise(UsersExistParams.forUserIds(userIds));
                respond(this.createSucessfulResponse(exist));
            } catch (error) {
                respond(this.createErrorResponse([error.message]));
                this.logger.error(this.TAG, `Error by checking if a group of users exist:`, error);
            }
        });
    }

    private async handleUsernameRequest(): Promise<void> {
        return; // Placed here to avoid crash
        await this.networkService.receiveUsernameRequest(async (userId: string, respond: (response:  ResponseWrapper) => void) => {
            try {
                const user = await this.getUserUseCase.asPromise(GetUserParams.forUserId(userId));
                respond(this.createSucessfulResponse(user.name));
            } catch (error) {
                this.logger.error(this.TAG, `Error by retrieving username by id:`, error);
                respond(this.createErrorResponse([error.message]));
            }         
        });
    }
}
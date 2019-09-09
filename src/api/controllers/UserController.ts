import { Controller } from "./Controller";
import { JsonController, Post, Body, Res, Get } from "routing-controllers";
import { Injector } from "../../main/di/Injector";
import { BusinessInjector } from '../../business/di/BusinessInjector';
import UserProvider from "../../data/datasource/database/provider/UserProvider";
import UserEntityMapper from "../../data/entities/mappers/UserEntityMapper";
import UserModelMapper from "../models/mappers/UserModelMapper";

@JsonController('/user') // Temporary controller
export default class LoginController extends Controller {
    private readonly TAG: string = this.constructor.name;

    private userProvider: UserProvider;

    public constructor() {
        super();
        this.userProvider = Injector.get<UserProvider>(BusinessInjector.USER_PROVIDER.value);
    }
    
    @Get('/')
    public async getUsers(@Res() res: any) {
        return res.send(this.createSucessfulResponseString(UserModelMapper.mapToModels(UserEntityMapper.mapToModels(await this.userProvider.getUsers().toPromise()))));
    }
}
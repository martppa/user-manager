import { Container } from "inversify";
import { DatabaseManager } from '../db/DatabaseManager';
import { MongoManager } from '../db/mongo/MongoManager';
import { Cypher } from '../../business/security/Cypher';
import { BcryptCypher } from '../../data/security/bcrypt/BcryptCypher';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import { RegisterUser } from '../../business/interactors/RegisterUser';
import UserRepository from '../../business/repositories/UserRepository';
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import UserPersister from "../../data/datastore/database/persister/UserPersister";
import UserDataStore from "../../data/datastore/UserDataStore";
import UserMongoPersister from "../../data/datastore/database/persister/mongodb/user/UserMongoPersister";
import UserDatabaseDataStore from "../../data/datastore/database/UserDataBaseDataStore";
import UserProvider from "../../data/datasource/database/provider/UserProvider";
import UserMongoProvider from '../../data/datasource/database/provider/mongodb/user/UserMongoProvider';
import UserDataSource from "../../data/datasource/UserDataSource";
import UserDatabaseDataSource from "../../data/datasource/database/UserDatabaseDataSource";
import { LoginUser } from '../../business/interactors/LoginUser';
import Tokener from '../../business/security/Tokener';
import JwtTokener from '../../data/security/jwt/JwtTokener';
import Validator from '../../api/validator/Validator';
import { ClassValidator } from '../../api/validator/classvalidator/ClassValidator';
import { RefreshToken } from '../../business/interactors/RefreshToken';
import SessionDataSource from '../../data/datasource/SessionDataSource';
import SessionDatabaseDataSource from '../../data/datasource/database/SessionDatabaseDataSource';
import SessionMongoProvider from '../../data/datasource/database/provider/mongodb/session/SessionMongoProvider';
import SessionProvider from "../../data/datasource/database/provider/SessionProvider";
import { SessionRepository } from '../../business/repositories/SessionRepository';
import SessionRepositoryImpl from '../../data/repositories/SessionRepositoryImpl';
import SessionDataStore from '../../data/datastore/SessionDataStore';
import SessionDatabaseDataStore from '../../data/datastore/database/SessionDatabaseDataStore';
import SessionMongoPersister from '../../data/datastore/database/persister/mongodb/session/SessionMongoPersister';
import SessionPersister from "../../data/datastore/database/persister/SessionPersister";
import { LogoutUser } from '../../business/interactors/LogoutUser';
import SessionNotifier from '../../business/com/SessionNotifier';
import SessionNotifierImpl from '../../com/SessionNotifierImpl';
import UuidGenerator from '../../business/security/UuidGenerator';
import UuiGeneratorImpl from "../../data/security/uuid/UuidGeneratorImpl";
import NetworkController from "../../com/controllers/NetworkController";
import UsersExist from "../../business/interactors/UsersExist";
import LocalConfigRequester from "../config/LocalConfigRequester";
import { GetUser } from "../../business/interactors/GetUser";
import EnvConfigRequester from "../config/EnvConfigRequester";
import Logger from "../../global/logger/Logger";
import WinstonLogger from "../../common/logger/winston/WinstonLogger";
import Server from "../../common/server/Server";
import ExpressServer from "../../common/server/express/ExpressServer";
import ConfigRequester from "../../common/config/ConfigRequester";

export class Injector extends BusinessInjector {
    private static readonly _container = new Container();
    
    public static readonly SERVICE_REGISTER = { value: Symbol.for('ServiceRegister')};
    public static readonly CONFIG_REQUESTER = { value: Symbol.for('ConfigRequester')};
    public static readonly DATABASE_MANAGER = { value: Symbol.for('DatabaseManager')};
    public static readonly SERVER = { value: Symbol.for('Server')};

    public static initialize() {
        this.bindConfig();
        this._container.bind<Logger>(this.LOGGER.value).to(WinstonLogger).inSingletonScope();
        this._container.bind<Server>(this.SERVER.value).to(ExpressServer).inSingletonScope();
        this._container.bind<DatabaseManager>(this.DATABASE_MANAGER.value).to(MongoManager).inSingletonScope();
        this._container.bind<Cypher>(this.CYPHER.value).to(BcryptCypher).inSingletonScope();
        this._container.bind<RegisterUser>(this.REGISTER_USER.value).to(RegisterUser).inSingletonScope();
        this._container.bind<LoginUser>(this.LOGIN_USER.value).to(LoginUser).inSingletonScope();
        this._container.bind<UserRepository>(this.USER_REPOSITORY.value).to(UserRepositoryImpl).inSingletonScope();
        this._container.bind<UserDataStore>(this.USER_DATA_STORE.value).to(UserDatabaseDataStore).inSingletonScope();
        this._container.bind<UserPersister>(this.USER_PERSISTER.value).to(UserMongoPersister).inSingletonScope();
        this._container.bind<UserProvider>(this.USER_PROVIDER.value).to(UserMongoProvider).inSingletonScope();
        this._container.bind<UserDataSource>(this.USER_DATA_SOURCE.value).to(UserDatabaseDataSource).inSingletonScope();
        this._container.bind<Tokener>(this.TOKENER.value).to(JwtTokener).inSingletonScope();
        this._container.bind<Validator>(this.VALIDATOR.value).to(ClassValidator).inSingletonScope();
        this._container.bind<RefreshToken>(this.REFRESH_TOKEN.value).to(RefreshToken).inSingletonScope();
        this._container.bind<SessionDataSource>(this.SESSION_DATASOURCE.value).to(SessionDatabaseDataSource).inSingletonScope();
        this._container.bind<SessionProvider>(this.SESSION_PROVIDER.value).to(SessionMongoProvider).inSingletonScope();
        this._container.bind<SessionRepository>(this.SESSION_REPOSITORY.value).to(SessionRepositoryImpl).inSingletonScope();
        this._container.bind<SessionDataStore>(this.SESSION_DATASTORE.value).to(SessionDatabaseDataStore).inSingletonScope();
        this._container.bind<SessionPersister>(this.SESSION_PERSISTER.value).to(SessionMongoPersister).inSingletonScope();
        this._container.bind<LogoutUser>(this.LOGOUT_USER.value).to(LogoutUser).inSingletonScope();
        this._container.bind<SessionNotifier>(this.SESSION_NOTIFIER).to(SessionNotifierImpl).inSingletonScope();
        this._container.bind<UuidGenerator>(this.UUI_GENERATOR).to(UuiGeneratorImpl).inSingletonScope();
        this._container.bind<GetUser>(this.GET_USER_USE_CASE).to(GetUser).inSingletonScope();
        this._container.bind<NetworkController>(this.EVENT_CONTROLLER).to(NetworkController).inSingletonScope();
        this._container.bind<UsersExist>(this.USERS_EXIST).to(UsersExist).inSingletonScope();
    }

    private static bindConfig(): void {
        if (process.env.USING_DOCKER) {
            this._container.bind<ConfigRequester>(this.CONFIG_REQUESTER.value).to(EnvConfigRequester).inSingletonScope();
        } else {
            this._container.bind<ConfigRequester>(this.CONFIG_REQUESTER.value).to(LocalConfigRequester).inSingletonScope();
        }
    }

    public static get<T>(symbol: symbol): T {
        return this._container.get<T>(symbol);
    }
}
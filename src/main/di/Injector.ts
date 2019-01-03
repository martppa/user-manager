import { Container } from "inversify";
import { DatabaseManager } from '../db/DatabaseManager';
import { MongoManager } from '../db/mongo/MongoManager';
import { Cypher } from '../../business/security/Cypher';
import { BcryptCypher } from '../../data/security/bcrypt/BcryptCypher';
import { BusinessInjector } from '../../business/di/BusinessInjector';
import { RegisterUser } from '../../business/interactors/RegisterUser';
import UserRepository from '../../business/repositories/UserRepository';
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import Logger from "chk2common/dist/logger/Logger";
import WinstonLogger from "chk2common/dist/logger/winston/WinstonLogger";
import ServiceRegister from "chk2common/dist/registration/ServiceRegister";
import Server from 'chk2common/dist/server/Server';
import ConfigRequester from 'chk2common/dist/config/ConfigRequester';
import CloudConfigRequester from 'chk2common/dist/config/cloudconfig/CloudConfigRequester';
import ExpressServer from 'chk2common/dist/server/express/ExpressServer';
import EurekaServiceRegister from 'chk2common/dist/registration/eureka/EurekaServiceRegister';
import UserPersister from "../../data/datastore/database/persister/UserPersister";
import UserDataStore from "../../data/datastore/UserDataStore";
import UserMongoPersister from "../../data/datastore/database/persister/mongodb/user/UserMongoDataPersister";
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

export class Injector extends BusinessInjector {
    private static readonly _container = new Container();   
    
    public static readonly SERVICE_REGISTER = { value: Symbol.for('ServiceRegister')};
    public static readonly CONFIG_REQUESTER = { value: Symbol.for('ConfigRequester')};
    public static readonly DATABASE_MANAGER = { value: Symbol.for('DatabaseManager')};
    public static readonly SERVER = { value: Symbol.for('Server')};

    static initialize() {
        this._container.bind<Logger>(this.LOGGER.value).to(WinstonLogger).inSingletonScope();
        this._container.bind<ServiceRegister>(this.SERVICE_REGISTER.value).to(EurekaServiceRegister).inSingletonScope();
        this._container.bind<Server>(this.SERVER.value).to(ExpressServer).inSingletonScope();
        this._container.bind<ConfigRequester>(this.CONFIG_REQUESTER.value).to(CloudConfigRequester).inSingletonScope();
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
    }

    static get container() {
        return this._container;
    }
}
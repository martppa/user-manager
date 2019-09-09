export class BusinessInjector  {
    public static readonly USE_CASE = { value: Symbol.for('UserCase')};
    public static readonly USER_PERSISTER = { value: Symbol.for('UserDataPersister')};
    public static readonly USER_PROVIDER = { value: Symbol.for('UserDataProvider')};
    public static readonly USER_DATA_STORE = { value: Symbol.for('UserDataStore')};
    public static readonly USER_DATA_SOURCE = { value: Symbol.for('UserDataSource')};
    public static readonly LOGGER = { value: Symbol.for('Logger')};
    public static readonly CYPHER = { value: Symbol.for('Cypher')};
    public static readonly USER_REPOSITORY = { value: Symbol.for('UserRepository')};
    public static readonly REGISTER_USER = { value: Symbol.for('RegisterUser')};
    public static readonly LOGIN_USER = { value: Symbol.for('LoginUser')};
    public static readonly TOKENER = { value: Symbol.for('Tokener')};
    public static readonly VALIDATOR = { value: Symbol.for('Validator')};
    public static readonly REFRESH_TOKEN = { value: Symbol.for('RefreshToken')};
    public static readonly SESSION_REPOSITORY = { value: Symbol.for('SessionRepository')};
    public static readonly SESSION_DATASOURCE = { value: Symbol.for('SessionDataSource')};
    public static readonly SESSION_DATASTORE = { value: Symbol.for('SessionDataStore')};
    public static readonly SESSION_PROVIDER = { value: Symbol.for('SessionProvider')};
    public static readonly SESSION_PERSISTER = { value: Symbol.for('SessionPersister')};
    public static readonly LOGOUT_USER = { value: Symbol.for('LogoutUser') };
    public static readonly MESSAGE_CLIENT = Symbol.for('MessageClient');
    public static readonly TOKEN_BROADCASTER = Symbol.for('TokenBroadcaster');
    public static readonly SESSION_NOTIFIER = Symbol.for('SessionNotifier');
    public static readonly UUI_GENERATOR = Symbol.for('UuiGenerator');
    public static readonly GET_USER_USE_CASE = Symbol.for('GetUserUseCase');
    public static readonly EVENT_CONTROLLER = Symbol.for('EventController');
    public static readonly USERS_EXIST = Symbol.for('UsersExist');
}
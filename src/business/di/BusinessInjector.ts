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
}
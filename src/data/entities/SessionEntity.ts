export default class SessionEntity {
    public constructor(private _token: string,
        private _refreshToken: string,
        private _userId: string) {}
    
    public get token(): string {
        return this._token;
    }

    public set token(token: string) {
        this._token = token;
    }

    public get refreshToken(): string {
        return this._refreshToken;
    }

    public set refreshToken(refreshToken: string) {
        this._refreshToken = refreshToken;
    }

    public get userId(): string {
        return this._userId;
    }

    public set userId(userId: string) {
        this._userId = userId;
    }
}
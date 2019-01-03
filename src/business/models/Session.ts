export default class Session {
    public constructor(private _token: string, 
        private _refreshToken: string) {}
    
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
}
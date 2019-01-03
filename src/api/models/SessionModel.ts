export default class SessionModel {
    public constructor(private token: string, 
        private refreshToken: string) {}
}
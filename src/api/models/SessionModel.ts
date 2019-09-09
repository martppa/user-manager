export default class SessionModel {
    public constructor(public token: string, 
        public refreshToken: string) {}
}
export default class Environment {
    public static get JWT_KEY(): string {
        return process.env.JWT_KEY;
    }
}
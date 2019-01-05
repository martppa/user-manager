export default interface Tokener {
    createToken(payload: any, cert: string, option?: any): Promise<string>;
    verify(token: string, key: string): Promise<any>;
}
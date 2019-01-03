export default interface Tokener {
    createToken(payload: any, cert: string, option?: any): string;
    verify(token: string, key: string): any;
}
import Tokener from '../../../business/security/Tokener';
import * as JWT from 'jsonwebtoken';
import { injectable } from 'inversify';

@injectable()
export default class JwtTokener implements Tokener {
    public createToken(payLoad: any, cert: string, option?: any): string {
        return JWT.sign(payLoad, cert, option);
    }

    public verify(token: string, key: string): any {
        return JWT.verify(token, key);
    }
}
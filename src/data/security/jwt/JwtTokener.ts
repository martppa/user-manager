import Tokener from '../../../business/security/Tokener';
import * as JWT from 'jsonwebtoken';
import { injectable } from 'inversify';

@injectable()
export default class JwtTokener implements Tokener {
    public async createToken(payload: any, cert: string, option?: any): Promise<string> {
        return JWT.sign(payload, cert, option);
    }

    public async verify(token: string, key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const decoded =  JWT.verify(token, key);
                resolve(decoded);
            } catch (error) {
                reject(error);
            }
        });
    }
}
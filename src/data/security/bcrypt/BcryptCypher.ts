import { Cypher } from '../../../business/security/Cypher';
import * as bcrypt from 'bcryptjs';
import { injectable } from 'inversify';

@injectable()
export class BcryptCypher implements Cypher {
    private static readonly SALT: number = 10;

    public async encrypt(data: string): Promise<string> {
        return bcrypt.hash(data, BcryptCypher.SALT);
    }

    public async compare(data: string, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}
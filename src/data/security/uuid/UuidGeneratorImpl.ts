import UuidGenerator from '../../../business/security/UuidGenerator';
import { injectable } from 'inversify';

@injectable()
export default class UuiGeneratorImpl implements UuidGenerator {
    private uuidv1: any;

    public constructor() {
        this.uuidv1 = require('uuid/v1');
    }

    public generate(): string {
        return this.uuidv1();
    }
}
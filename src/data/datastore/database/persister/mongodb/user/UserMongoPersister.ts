import UserPersister from '../../UserPersister';
import { Observable, Subscriber, observable } from 'rxjs';
import UserSchemaMapper from '../../../../../entities/mappers/UserSchemaMapper';
import { injectable, inject } from 'inversify';
import Errors from '../../../../../../business/constants/Errors';
import { BusinessInjector } from '../../../../../../business/di/BusinessInjector';
import Logger from 'chk2global/dist/logger/Logger';
import UuidGenerator from '../../../../../../business/security/UuidGenerator';

@injectable()
export default class UserMongoPersister implements UserPersister {
    private readonly TAG: string = this.constructor.name;
    
    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    @inject(BusinessInjector.UUI_GENERATOR)
    private uuiGenerator: UuidGenerator;

    public saveUser(username: string, email: string, password: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            const userId: string = this.uuiGenerator.generate();
            const userSchema = UserSchemaMapper.mapToSchema(userId, username, email, password);
            try {
                await userSchema.save();
                subscriber.complete();
            } catch (error) {
                this.logger.error(this.TAG, `Error when saving user: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
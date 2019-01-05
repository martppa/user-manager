import UserPersister from '../../UserPersister';
import { Observable, Subscriber, observable } from 'rxjs';
import UserSchemaMapper from '../../../../../entities/mappers/UserSchemaMapper';
import { injectable, inject } from 'inversify';
import Errors from '../../../../../../business/constants/Errors';
import { BusinessInjector } from '../../../../../../business/di/BusinessInjector';
import Logger from 'chk2common/dist/logger/Logger';

@injectable()
export default class UserMongoPersister implements UserPersister {
    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    public saveUser(username: string, email: string, password: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            const userSchema = UserSchemaMapper.mapToSchema(username, email, password);
            try {
                await userSchema.save();
                subscriber.complete();                
            } catch (error) {
                this.logger.error(error);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
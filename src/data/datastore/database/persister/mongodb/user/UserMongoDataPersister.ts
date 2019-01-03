import UserPersister from '../../UserPersister';
import { Observable, Subscriber, observable } from 'rxjs';
import UserSchemaMapper from '../../../../../entities/mappers/UserSchemaMapper';
import * as Mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import Errors from '../../../../../../business/constants/Errors';
import { BusinessInjector } from '../../../../../../business/di/BusinessInjector';
import Logger from 'chk2common/dist/logger/Logger';

@injectable()
export default class UserMongoPersister implements UserPersister {
    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;
    private userSchema: Mongoose.Document;

    public saveUser(username: string, email: string, password: string): Observable<any> {
        return Observable.create(async (subscriber: Subscriber<any>) => {
            this.userSchema = UserSchemaMapper.mapToSchema(username, email, password);
            try {
                await this.userSchema.save();
                subscriber.complete();                
            } catch (error) {
                this.logger.error(error);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
import Logger from 'chk2common/dist/logger/Logger';
import { Observable, Subscriber } from 'rxjs';
import UserEntity from '../../../../../entities/UserEntity';
import UserProvider from '../../UserProvider';
import { UserSchema } from '../../../../../entities/UserSchema';
import UserSchemaMapper from '../../../../../entities/mappers/UserSchemaMapper';
import { injectable, inject } from 'inversify';
import * as Mongoose from 'mongoose';
import { BusinessInjector } from '../../../../../../business/di/BusinessInjector';
import Errors from '../../../../../../business/constants/Errors';

@injectable()
export default class UserMongoProvider implements UserProvider {
    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;
    
    public getUserByName(name: string): Observable<UserEntity> {
        return Observable.create(async (subscriber: Subscriber<UserEntity>) => {
            try {
                const foundUser = await this.retrieveUserByName(name);
                subscriber.next(UserSchemaMapper.mapToEntity(foundUser));
                subscriber.complete();                
            } catch (error) {
                this.logger.error(error);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }

    public getUserById(id: string): Observable<UserEntity> {
        return Observable.create(async (subscriber: Subscriber<UserEntity>) => {
            try {
                const foundUser = await this.retrieveUserById(id);
                subscriber.next(UserSchemaMapper.mapToEntity(foundUser));
                subscriber.complete();                
            } catch (error) {
                this.logger.error(error);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }

    private retrieveUserByName(name: string): Promise<Mongoose.Document> {
        return UserSchema.findOne({ $or:
            [{ "name": name }, 
            { "email": name }]}).exec();
    }

    private retrieveUserById(id: string): Promise<Mongoose.Document> {
        return UserSchema.findById(id).exec();
    }
}
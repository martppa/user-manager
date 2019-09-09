import Logger from 'chk2global/dist/logger/Logger';
import { Observable, Subscriber, of } from 'rxjs';
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
    private readonly TAG: string = this.constructor.name;

    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;
    
    public getUserBy(name: string, email?: string): Observable<UserEntity> {
        return Observable.create(async (subscriber: Subscriber<UserEntity>) => {
            try {
                const foundUser = await this.retrieveUserBy(name, email);
                subscriber.next(UserSchemaMapper.mapToEntity(foundUser));
                subscriber.complete();                
            } catch (error) {
                this.logger.error(this.TAG, `Error when querying user by username or email: ${error}`);
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
                this.logger.error(this.TAG,`Error when querying user by id: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }

    public usersExist(userIds: string[]): Observable<boolean> {
        return Observable.create(async (subscriber: Subscriber<boolean>) => {
            try {
                subscriber.next(await this.checkIfUsersExist(userIds));
                subscriber.complete();                
            } catch (error) {
                this.logger.error(this.TAG,`Error when querying users by id to check if they exists: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }

    public getUsers(): Observable<UserEntity[]> {
        return Observable.create(async (subscriber: Subscriber<UserEntity[]>) => {
            try {
                const retirevedUsers = await this.retrieveUsers();
                subscriber.next(UserSchemaMapper.mapToEntities(retirevedUsers));
                subscriber.complete();                
            } catch (error) {
                this.logger.error(this.TAG,`Error when querying users: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }

    private retrieveUserBy(name: string, email?: string): Promise<Mongoose.Document> {
        return UserSchema.findOne({ $or:
            [{ "name": name }, 
            { "email": email }]}).exec();
    }

    private retrieveUserById(id: string): Promise<Mongoose.Document> {
        return UserSchema.findOne({ id: id }).exec();
    }

    private async checkIfUsersExist(userIds: string[]): Promise<boolean> {
        const foundUsers = await UserSchema.find({ id: { $in: userIds }}).exec();
        return  foundUsers && foundUsers.length == userIds.length;
    }

    private async retrieveUsers(): Promise<Mongoose.Document[]> {
        return await UserSchema.find().exec();
    }
}
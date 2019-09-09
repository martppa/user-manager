import { UserSchema, UserSchemaField } from '../UserSchema';
import UserEntity from '../UserEntity';
import * as Mongoose from 'mongoose';

export default class UserSchemaMapper {
    public static mapToSchema(id: string, username: string, email: string, password: string) {
        const userSchema = new UserSchema();
        userSchema[UserSchemaField.id] = id;
        userSchema[UserSchemaField.name] = username;
        userSchema[UserSchemaField.email] = email;
        userSchema[UserSchemaField.password] = password;
        return userSchema;
    }

    public static mapToEntity(userSchema: Mongoose.Document): UserEntity {
        if (!userSchema) return undefined;
        return new UserEntity(userSchema[UserSchemaField.id],
            userSchema[UserSchemaField.name], 
            userSchema[UserSchemaField.email],
            userSchema[UserSchemaField.password]);
    }

    public static mapToEntities(documents: Mongoose.Document[]): UserEntity[] {
        const userEntities = new Array<UserEntity>();
        documents.forEach(document => userEntities.push(UserSchemaMapper.mapToEntity(document)));
        return userEntities;
    }
}
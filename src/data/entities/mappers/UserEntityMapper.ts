import User from '../../../business/models/User';
import UserEntity from '../UserEntity';

export default class UserEntityMapper {
    public static mapToModel(userEntity: UserEntity): User {
        if (!userEntity) return undefined;
        return new User(userEntity.id, userEntity.name, userEntity.email, userEntity.password);
    }
}
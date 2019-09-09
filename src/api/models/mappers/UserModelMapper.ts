import User from '../../../business/models/User';
import UserModel from '../UserModel';

export default class UserModelMapper {

    public static mapToModel(user: User): UserModel {
        if (!user) return undefined;
        return new UserModel(user.id, user.name, user.email, user.password);
    }

    public static mapToModels(users: User[]): UserModel[] {
        const userModels = new Array<UserModel>();
        users.forEach(userEntity => userModels.push(UserModelMapper.mapToModel(userEntity)));
        return userModels;
    }
}
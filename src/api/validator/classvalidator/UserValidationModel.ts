import { Length, IsEmail } from 'class-validator';
import Errors from '../../../business/constants/Errors';

export default class UserValidationModel {
    @Length(3, 20, {
        message: Errors.INVALID_USERNAME
    })
    private _name: string;

    @IsEmail({}, {
        message: Errors.INVALID_EMAIL
    })
    private _email: string;

    @Length(8, 50, {
        message: Errors.INVALID_PASSWORD
    })
    private _password: string;

    public constructor(name: string, email: string, password: string) {
        this._name = name;
        this._email = email;
        this._password = password;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }
}
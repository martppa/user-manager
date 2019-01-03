import Errors from "../../../business/constants/Errors";
import { Length } from "class-validator";

export default class LoginDataValidationModel {
    @Length(3, 20, {
        message: Errors.INVALID_USERNAME
    })
    private _name: string;

    @Length(8, 50, {
        message: Errors.INVALID_PASSWORD
    })
    private _password: string;

    public constructor(name: string, password: string) {
        this._name = name;
        this._password = password;
    }
}
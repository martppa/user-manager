import { MinLength } from "class-validator";
import Errors from "../../../business/constants/Errors";

export default class RefreshTokenValidationModel {
    @MinLength(10, {
        message: Errors.INVALID_TOKEN
    })
    private refreshToken: string;

    public constructor(refreshToken: string) {
        this.refreshToken = refreshToken;
    }
}
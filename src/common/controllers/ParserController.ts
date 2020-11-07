import { injectable } from "inversify";
import ErrorCode from "../../global/constants/error/ErrorCode";
import { ResponseWrapper, Status } from "../../global/network/ResponseWrapper";
import * as HttpStatus from 'http-status-codes';

@injectable()
export default class ParserController {
    public createErrorResponseString(errors: string[]): string {
        return JSON.stringify(this.createErrorResponse(errors));
    }

    public createEmptySucessfulResponseString(): string {
        return this.createSucessfulResponseString(undefined);
    }

    public createSucessfulResponseString(content: any): string {
        return JSON.stringify(this.createSucessfulResponse(content));
    }

    public createErrorResponse(errors: string[]): ResponseWrapper {
        return new ResponseWrapper(Status.ERROR, errors, undefined);
    }

    public createEmptySucessfulResponse(): ResponseWrapper {
        return this.createSucessfulResponse(undefined);
    }

    public createSucessfulResponse(content: any): ResponseWrapper {
        return new ResponseWrapper(Status.OK, undefined, content);
    }

    public extractErrorCode(errorMessage: string): number {
        switch(errorMessage) {
            case ErrorCode.USER_DOESNT_EXIST:
            case ErrorCode.WRONG_PASSWORD:
                return HttpStatus.FORBIDDEN;

            case ErrorCode.INVALID_PASSWORD:
            case ErrorCode.INVALID_USERNAME:
                return HttpStatus.BAD_REQUEST;

            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
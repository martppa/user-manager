import { ResponseWrapper, Status } from "chk2global/dist/network/ResponseWrapper";
import { injectable } from "inversify";

@injectable()
export abstract class Controller {
    protected createErrorResponseString(errors: string[]): string {
        return JSON.stringify(this.createErrorResponse(errors));
    }

    protected createEmptySucessfulResponseString(): string {
        return this.createSucessfulResponseString(undefined);
    }

    protected createSucessfulResponseString(content: any): string {
        return JSON.stringify(this.createSucessfulResponse(content));
    }

    protected createErrorResponse(errors: string[]): ResponseWrapper {
        return new ResponseWrapper(Status.ERROR, errors, undefined);
    }

    protected createEmptySucessfulResponse(): ResponseWrapper {
        return this.createSucessfulResponse(undefined);
    }

    protected createSucessfulResponse(content: any): ResponseWrapper {
        return new ResponseWrapper(Status.OK, undefined, content);
    }
}
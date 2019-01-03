import { ResponseWrapper, Status } from "chk2global/dist/network/ResponseWrapper";

export abstract class Controller {
    protected createErrorResponse(errors: string[]): string {
        return new ResponseWrapper(Status.ERROR, errors, undefined).stringify();
    }

    protected createEmptySucessfulResponse(): string {
        return this.createSucessfulResponse(undefined);
    }

    protected createSucessfulResponse(content: any): string {
        return new ResponseWrapper(Status.OK, new Array<string>(), content).stringify();
    }
}
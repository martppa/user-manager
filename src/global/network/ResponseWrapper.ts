export class ResponseWrapper {
    private status: Status;
    private errors: string[];
    private content: any;

    public constructor(status: Status, errors: string[], content: any) {
        this.status = status;
        this.errors = errors? errors : new Array<string>();
        this.content = content;
    }

    public getStatus(): Status {
        return this.status;
    }

    public setStatus(status: Status) {
        this.status = status;
    }

    public getErrors(): string[] {
        return this.errors;
    }

    public setErrors(errors: string[]) {
        this.errors = errors;
    }

    public getContent(): any {
        return this.content;
    }

    public setContent(content: any) {
        this.content = content;
    }

    public stringify(): string {
        return JSON.stringify(this);
    }

    public static fromJson(json: string): ResponseWrapper {
        const obj = JSON.parse(json);
        return new ResponseWrapper(obj['status'], obj['errors'], obj['content']);
    }

    public static fromObject(obj: any) {
        return new ResponseWrapper(obj.status, obj.errors, obj.content);
    }
}

export enum Status {
    OK = 0,
    ERROR = 1
}
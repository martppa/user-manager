export default interface Validator {
    validate(data: any): Promise<string[]>;
}
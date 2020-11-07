export default interface ConfigRequester {
    requestConfig(): Promise<any>;
}
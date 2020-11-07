export default interface Logger {
    info(tag: string, message: string): void;
    warn(tag: string, message: string): void;
    error(tag: string, message: string, error?: Error): void;
    debug(tag: string, message: string): void;
}
export default interface Server {
    listen(port: number): Promise<void>;
}
export interface Cypher {
    encrypt(data: string): Promise<string>;
    compare(data: string, hash: string): Promise<boolean>;
}
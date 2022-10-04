import { Db } from 'mongodb';

export interface CoreConfig {
    baseUrl: string;
    dbUrl: string;
    dbMain: string;
    dbPrefix: string;
    clientBaseUrl: string;
}

export interface UserRepository {
    indexesCreated: boolean;
    createIndexes(): Promise<void>;
    getByToken(tokenId: string): Promise<User>;
}

export interface ValidatesUsers {}

export interface User extends HasId, HasName {
    wallets: string[];
    following?: string[];
}

export interface HasId {
    _id: string;
}

export interface HasName {
    name: string;
}

export interface HasTimestamp {
    updatedAt: Date;
    createdAt: Date;
}

export interface AccessToken extends HasTimestamp, HasId {
    userId: string;
    expiryDate: Date;
}

export interface NFTRepository {}

export interface ValidatesNFTs {}

export interface NFT extends HasId, HasName {
    description: string;
    userId: string;
}

export interface ManagesDbs {
    initialize(): Promise<void>;
    mainDb(): Db;
    db(name: string): Db;
}

export interface Container {
    readonly users: UserRepository;
    readonly nfts: NFTRepository;
}

export type AuthContextType = 'user' | 'system';

export interface AuthContext {
    _id: string;
    type?: AuthContextType;
}
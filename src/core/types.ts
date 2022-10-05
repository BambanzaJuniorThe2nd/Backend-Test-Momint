import { Db, ObjectId } from 'mongodb';

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
    getAll(): Promise<User[]>;
    getAllNftsBy(id: string): Promise<NFT[]>;
}

export interface ValidatesUsers {}

export interface User extends HasId, HasName {
    wallets: string[];
    following?: string[];
}

export interface HasId {
    _id: ObjectId;
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

export interface NFTRepository {
    getAll(): Promise<NFT[]>;
    getAllByUserId(userId: string): Promise<NFT[]>;
}

export interface ValidatesNFTs {}

export interface NFT extends HasId, HasName {
    description: string;
    userId: ObjectId;
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
    _id: ObjectId;
    type?: AuthContextType;
}
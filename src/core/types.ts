export interface CoreConfig {
    baseUrl: string;
    dbUrl: string;
    dbMain: string;
    dbPrefix: string;
    sampleHost: string;
    samplePort: number;
    sampleUser: string;
    samplePassword: string;
    sampleDatabase: string;
    sampleConnection: string;
    clientBaseUrl: string;
}

export interface UserRepository {
    indexesCreated: boolean;
    createIndexes(): Promise<void>;
}

export interface ValidatesUsers {}

export interface User {}

export interface HasId {
    _id: string;
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
    indexesCreated: boolean;
    createIndexes(): Promise<void>;
}

export interface ValidatesNFTs {}

export interface NFT {}

export interface Container {
    readonly users: UserRepository;
    readonly nfts: NFTRepository;
}
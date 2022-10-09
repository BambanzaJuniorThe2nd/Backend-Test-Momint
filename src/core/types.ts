import { Db, ObjectId } from 'mongodb';

export interface CoreConfig {
  baseUrl: string;
  dbUrl: string;
  dbMain: string;
  dbPrefix: string;
  clientBaseUrl: string;
  metamaskKey: string;
  rpcUrl: string;
}

export interface UserRepository {
  indexesCreated: boolean;
  createIndexes(): Promise<void>;
  getByToken(tokenId: string): Promise<User>;
  getAll(): Promise<User[]>;
  getNftsById(args: UserGetNFTsByIdArgs): Promise<NFT[]>;
  getFeedById(args: UserGetFeedByIdArgs): Promise<NFT[]>;
}

export interface ValidatesUsers {
  validateGetNftsById(args: UserGetNFTsByIdArgs): void;
  validateGetFeedById(args: UserGetFeedByIdArgs): void;
}

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
  getAllByUserId(userId: string, limit: number): Promise<NFT[]>;
  getOwnerById(id: string): Promise<NFTOwner>;
}

export interface NFTOptions {
  metamaskKey: string;
  rpcUrl: string;
}

export interface ValidatesNFTs {
  validateGetOwnerById(id: string): void;
}

export interface Contract {
  address: string;
  blockchain: string;
}

export interface TokenId {
  _hex: string;
  _isBigNumber: boolean;
}

export interface NFT extends HasId, HasName {
  description: string;
  contract?: Contract;
  tokenId?: TokenId;
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

export interface Pagination {
  skip?: number;
  limit?: number;
}

export interface UserGetFeedByIdArgs {
  id: string;
  pagination: Pagination;
}

export interface UserGetNFTsByIdArgs extends UserGetFeedByIdArgs {}

export interface NFTOwner {
  blockchainOwner: string;
  userId: string;
}

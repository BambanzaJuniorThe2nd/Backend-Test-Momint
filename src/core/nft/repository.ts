import { NFT, NFTRepository, ValidatesNFTs } from '../types';
import {
    ManagesDbs,
    util,
    CoreError,
    ErrorCode,
    CoreMessage as messages,
    AccessToken
} from '..';
import { Db, Collection, FindOptions, ObjectId } from 'mongodb';

const COLLECTION = 'nfts';

export class NFTs implements NFTRepository {
    readonly dbManager: ManagesDbs;
    readonly db: Db;
    readonly collection: Collection<NFT>;
    readonly validator: ValidatesNFTs;

    constructor (dbManager: ManagesDbs, validator: ValidatesNFTs) {
        this.dbManager = dbManager;
        this.db = dbManager.mainDb();
        this.collection = this.db.collection(COLLECTION);
        this.validator = validator;
    }

    async getAll(): Promise<NFT[]> {
        try {
            const result = await this.collection.find({});
            return await result.toArray();
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }

    async getAllByUserId(userId: string): Promise<NFT[]> {
        try {
            const result = await this.collection.find({ userId: new ObjectId(userId) });
            return await result.toArray();
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }
}
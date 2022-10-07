import { NFT, NFTRepository, ValidatesNFTs } from '../types';
import {
    ManagesDbs,
    util,
    CoreError,
    ErrorCode,
    CoreMessage as messages,
    AccessToken
} from '..';
import { Db, Collection, ObjectId } from 'mongodb';

const COLLECTION = 'nfts';

export class NFTs implements NFTRepository {
    readonly dbManager: ManagesDbs;
    readonly db: Db;
    readonly collection: Collection<NFT>;
    readonly validator: ValidatesNFTs;
    private _indexesCreated: boolean;

    constructor (dbManager: ManagesDbs, validator: ValidatesNFTs) {
        this.dbManager = dbManager;
        this.db = dbManager.mainDb();
        this.collection = this.db.collection(COLLECTION);
        this.validator = validator;
        this._indexesCreated = false;
    }

    /**
     * check whether indexes have been created
     * on nfts collection
     */
     get indexesCreated (): boolean {
        return this._indexesCreated;
    }

    /**
     * creates required indexes on
     * nfts collections
     * @throws DB_ERROR
     */
     async createIndexes (): Promise<void> {
        if (this._indexesCreated) return;
        try {
            await this.collection.createIndex({ _id: 1 }, {});
            this._indexesCreated = true;
        }
        catch (e) {
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
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

    async getAllByUserId(userId: string, limit: number): Promise<NFT[]> {
        try {
            const result = await this.collection.find({ userId: new ObjectId(userId) }).limit(limit);
            return await result.toArray();
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }

    async getAllByUserIds(userIds: string[], limit: number): Promise<NFT[]> {
        try {
            const result = await this.collection.find({ userId: { $in: userIds.map(userId => new ObjectId(userId)) } }).limit(limit);
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
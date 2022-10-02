import { 
    NFT,
    NFTRepository,
    ValidatesNFTs,
} from '../types';
import {
    util,
    CoreError,
    ErrorCode,
    CoreMessage as messages,
    AccessToken
} from '..';
import { Db, Collection, FindOptions } from 'mongodb';

const COLLECTION = 'users';
const TOKEN_COLL = 'access_tokens';

export class NFTs implements NFTRepository {
    readonly db: Db;
    readonly validator: ValidatesNFTs;
    readonly collection: Collection<NFT>;
    private _indexesCreated: boolean;

    constructor (db: Db, validator: ValidatesNFTs) {
        this.db = db;
        this.validator = validator;
        this.collection = db.collection(COLLECTION);
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
     * users collections
     * @throws DB_ERROR
     */
     async createIndexes (): Promise<void> {
        if (this._indexesCreated) return;
        try {
            // ttl collection for access tokens expiry
            await this.tokenCollection.createIndex({ expiryDate: 1},
                { expireAfterSeconds: 1 });
            this._indexesCreated = true;
        }
        catch (e) {
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }
}
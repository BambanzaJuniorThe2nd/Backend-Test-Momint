import { NFT, NFTRepository, ValidatesNFTs } from '../types';
import {
    ManagesDbs,
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
}
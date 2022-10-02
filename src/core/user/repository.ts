import { DateTime } from 'luxon';
import { 
    User,
    UserRepository,
    ValidatesUsers,
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

export class Users implements UserRepository {
    readonly db: Db;
    readonly validator: ValidatesUsers;
    readonly collection: Collection<User>;
    readonly tokenCollection: Collection<AccessToken>;
    private _indexesCreated: boolean;

    constructor (db: Db, validator: ValidatesUsers) {
        this.db = db;
        this.validator = validator;
        this.collection = db.collection(COLLECTION);
        this.tokenCollection = db.collection(TOKEN_COLL);
        this._indexesCreated = false;
    }

    /**
     * check whether indexes have been created
     * on users collection
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
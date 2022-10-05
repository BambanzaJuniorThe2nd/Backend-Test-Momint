import { DateTime } from 'luxon';
import { User, UserRepository, ValidatesUsers, NFTRepository, NFT } from '../types';
import {
    util,
    CoreError,
    ErrorCode,
    CoreMessage as messages,
    AccessToken
} from '..';
import { Db, Collection, FindOptions, ObjectId } from 'mongodb';

const COLLECTION = 'users';
const TOKEN_COLL = 'access_tokens';

/**
 * returns the user object with "secret"
 * properties removed
 * @param rawUser raw user from database
 */
 const getSafeUser = (rawUser: any): User => {
    // const { _id, email, name, createdAt, updatedAt } = rawUser;
    // return {
    //     _id,
    //     name,
    //     email,
    //     createdAt,
    //     updatedAt
    // };
    return rawUser;
};

export class Users implements UserRepository {
    readonly db: Db;
    readonly validator: ValidatesUsers;
    readonly collection: Collection<User>;
    readonly tokenCollection: Collection<AccessToken>;
    readonly nfts: NFTRepository;
    private _indexesCreated: boolean;

    constructor (db: Db, validator: ValidatesUsers, nfts: NFTRepository) {
        this.db = db;
        this.validator = validator;
        this.collection = db.collection(COLLECTION);
        this.tokenCollection = db.collection(TOKEN_COLL);
        this.nfts = nfts;
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

    /**
     * helper to check whether token is in valid format
     * @param token access token
     * @throws INVALID_ACCESS_TOKEN token format is invalid or not given
     */
     private validateToken (token: string) {
        if (!token) {
            throw new CoreError(
                messages.ERROR_ACCESS_TOKEN_REQUIRED, ErrorCode.INVALID_ACCESS_TOKEN);
        }
        if (typeof token !== 'string' || !util.isToken(token)) {
            throw new CoreError(
                messages.ERROR_ACCESS_TOKEN_INVALID, ErrorCode.INVALID_ACCESS_TOKEN);
        }
    }

    /**
     * fetch user who owns the specified access token, if the
     * token is valid
     * @param tokenId access token
     * @throws VALIDATION_ERROR, INVALID_ACCESS_TOKEN and DB_ERROR
     */
    async getByToken(tokenId: string): Promise<User> {
        this.validateToken(tokenId);
        try {
            const options = <FindOptions>{ projection: { userId: 1} };
            const token = await this.tokenCollection.findOne(
                {_id: new ObjectId(tokenId), expiryDate: {$gte: new Date()}}, options);
            if (!token) {
                throw new CoreError(
                    messages.ERROR_ACCESS_TOKEN_INVALID, ErrorCode.INVALID_ACCESS_TOKEN);
            }
            const userId = token.userId;
            const user = await this.collection.findOne({_id: new ObjectId(userId)});
            return getSafeUser(user);
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }

    async getAll(): Promise<User[]> {
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

    async getAllNftsBy(id: string): Promise<NFT[]> {
        try {
            return await this.nfts.getAllByUserId(id);
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }
}
import { DateTime } from 'luxon';
import { User, UserRepository, ValidatesUsers, NFT, UserGetFeedByIdArgs, UserGetNFTsByIdArgs } from '../types';
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
            await this.collection.createIndex({ _id: 1}, {});

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
            return user;
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

    async getNftsById(args: UserGetNFTsByIdArgs): Promise<NFT[]> {
        this.validator.validateGetNftsById(args);
        try {
            const { id, pagination: { skip, limit } } = args;
            const projectionStage = { $project: { _id: 0, nfts: 1 } };
            const skipStage = skip ? { $skip: skip } : { $skip: 0 };
            const limitStage = limit ? { $limit: limit } : { $limit: 3 };

            const user = await this.collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                throw new CoreError(messages.ERROR_USER_NOT_FOUND, ErrorCode.DB_OBJECT_NOT_FOUND);
            }

            const result = await this.collection.aggregate<{ nfts: NFT[] }>([
                { $match: { _id: new ObjectId(id) } },
                {
                    $graphLookup: {
                        from: 'nfts',
                        startWith: '$_id',
                        connectFromField: '_id',
                        connectToField: 'userId',
                        as: 'nfts',
                    }
                },
                projectionStage,
                { $unwind: { path: '$nfts' } },
                { $sort: { 'nfts._id': 1 } },
                skipStage,
                limitStage,
                {
                    $group: {
                        _id: '$_id',
                        nfts: { $push: '$nfts' }
                    }
                },
                projectionStage
            ]);

            const result_array = await result.toArray();
            return result_array[0].nfts;
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }

    async getFeedById(args: UserGetFeedByIdArgs): Promise<NFT[]> {
        this.validator.validateGetFeedById(args);
        try {
            const { id, pagination: { skip, limit } } = args;
            const projectionStage = { $project: { _id: 0, feed: 1 } };
            const skipStage = skip ? { $skip: skip } : { $skip: 0 };
            const limitStage = limit ? { $limit: limit } : { $limit: 10 };

            const user = await this.collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                throw new CoreError(messages.ERROR_USER_NOT_FOUND, ErrorCode.DB_OBJECT_NOT_FOUND);
            }

            const result = await this.collection.aggregate<{ feed: NFT[] }>([
                { $match: { _id: new ObjectId(id) } },
                {
                    $graphLookup: {
                        from: 'nfts',
                        startWith: '$following',
                        connectFromField: 'following',
                        connectToField: 'userId',
                        as: 'feed',
                    }
                },
                projectionStage,
                { $unwind: { path: '$feed' } },
                { $sort: { 'feed._id': 1 } },
                skipStage,
                limitStage,
                {
                    $group: {
                        _id: '$_id',
                        feed: { $push: '$feed' }
                    }
                },
                projectionStage
            ]);

            const result_array = await result.toArray();
            return result_array[0].feed;
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }
}
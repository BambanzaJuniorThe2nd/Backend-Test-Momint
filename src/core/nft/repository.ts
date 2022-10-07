import { NFT, NFTRepository, ValidatesNFTs, NFTOwner } from '../types';
import {
    ManagesDbs,
    util,
    CoreError,
    ErrorCode,
    CoreMessage as messages,
    AccessToken
} from '..';
import { ethers } from 'ethers';
import { Db, Collection, ObjectId } from 'mongodb';

const COLLECTION = 'nfts';
// const nftAbi = [
//     {"inputs": [],"stateMutability":"nonpayable","type":"constructor"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"originalToken","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOfBatch","type":"uint256"}],"name":"Batch","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
//     {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bool","name":"approve","type":"bool"}],"name":"approveBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"batchInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"batchOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"batchTokenIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"burnTokenFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isBatch","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     {"inputs":[],"name":"killContract","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"originalId","type":"uint256"}],"name":"mintManyOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"string","name":"batchURI","type":"string"},{"internalType":"uint256","name":"amountOfBatch","type":"uint256"}],"name":"mintNft","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"originalId","type":"uint256"}],"name":"mintOneOfBatch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"originalTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"bool","name":"state","type":"bool"}],"name":"pauseContract","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}
// ]

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

    async getOwnerById(id: string): Promise<NFTOwner> {
        this.validator.validateGetOwnerById(id);
        try {
            const projectionStage = { $project: { _id: 0, feed: 1 } };

            const nft = await this.collection.findOne<NFT>({ _id: new ObjectId(id) });
            if (!nft) {
                throw new CoreError(messages.ERROR_NFT_NOT_FOUND, ErrorCode.DB_OBJECT_NOT_FOUND);
            }

            if (!nft.contract || !nft.tokenId) {
                throw new CoreError(messages.ERROR_NFT_WITHOUT_CONTRACT, ErrorCode.AGGREGATION_FAILED);
            }
            return await { blockchainOwner: 'owner', userId: 'user id' };
        }
        catch (e) {
            if (e instanceof CoreError) {
                throw e;
            }
            throw new CoreError(e.message, ErrorCode.DB_ERROR);
        }
    }

    // private onChainOwner = async (contractId: ObjectId, tokenNumber: number) => {
    //     const contractDetails = await DbClient.db.collection<NftContract>('contracts').findOne({ _id: contractId });
    //     const provider = new ethers.providers.JsonRpcProvider(NftService.getBlockchainGateway(contractDetails.blockchain));
    //     const signer = new ethers.Wallet(contractDetails.keys.private, provider);
    //     const contract = new ethers.Contract(contractDetails.contractAddress, nftAbi, signer);
    //     return await contract.ownerOf(tokenNumber);
    // };
}
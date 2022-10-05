import { CoreConfig, Container } from './types';
import { DbManager } from './db-manager';
import { Users, UserValidator } from './user';
import { NFTs, NFTValidator } from './nft';

export const bootstrap = async (config: CoreConfig): Promise<Container> => {

    // init db
    const dbManager = new DbManager(config.dbUrl,
        { prefix: config.dbPrefix, mainDb: config.dbMain });
    await dbManager.initialize();

    // init nfts
    const nftValidator = new NFTValidator();
    const nfts = new NFTs(dbManager, nftValidator);

    const userValidator = new UserValidator();
    const users = new Users(dbManager.mainDb(), userValidator, nfts);
    await users.createIndexes();


    return Object.freeze({
        users,
        nfts
    });
};
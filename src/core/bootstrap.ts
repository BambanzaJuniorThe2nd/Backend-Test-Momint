import { CoreConfig, Container } from './types';
import { DbManager } from './db-manager';
import { Users, UserValidator } from './user';
import { NFTs, NFTValidator } from './nft';

export const bootstrap = async (config: CoreConfig): Promise<Container> => {
  // init db
  const dbManager = new DbManager(config.dbUrl, {
    prefix: config.dbPrefix,
    mainDb: config.dbMain,
  });
  await dbManager.initialize();

  // init users
  const userValidator = new UserValidator();
  const users = new Users(dbManager.mainDb(), userValidator);
  await users.createIndexes();

  // init nfts
  const nftValidator = new NFTValidator();
  const nfts = new NFTs(dbManager, nftValidator, {
    metamaskKey: config.metamaskKey,
    rpcUrl: config.rpcUrl,
  });

  return Object.freeze({
    users,
    nfts,
  });
};

import { CoreConfig, Container } from './types';
import { DbManager } from './db-manager';
import { Users, UserValidator } from './user';
import { NFTs, NFTValidator } from './nft';

export const bootstrap = async (config: CoreConfig): Promise<Container> => {

    // init db
    const dbManager = new DbManager(config.dbUrl,
        { prefix: config.dbPrefix, mainDb: config.dbMain });
    await dbManager.initialize();

    const userValidator = new UserValidator();
    const users = new Users(dbManager.mainDb(), userValidator, email);
    await users.createIndexes();

    const projectValidator = new ProjectValidator();
    const indexedProjects = new Projects(dbManager, projectValidator, projectsOpts);
    await indexedProjects.createIndexes();
    const projects = guardProjects(indexedProjects);


    return Object.freeze({
        users,
        projects
    });
};
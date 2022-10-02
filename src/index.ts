import { Logger, transports } from 'winston';
import { bootstrap as bootstrapCore, CoreConfig } from './core';
import { createServer, startServer, ServerConfig } from './server';
// import { mountApi, RestConfig } from './rest';
// import { EventEmitter } from 'events';
// import { DataSourceRegistry } from './core/data-source';
// import { registerDataSources } from './data-sources';


interface SuperConfig extends CoreConfig, ServerConfig, RestConfig {

}

const logger = new Logger({
    transports: [
        new transports.Console()
    ]
});

const loadConfig = (env: any): SuperConfig => {
    return {
        dbUrl: env.DB_URL || 'mongodb://localhost:27017',
        dbPrefix: env.DB_PREFIX || 'surix_',
        dbMain: env.DB_MAIN || 'main',
        port: env.PORT || 5000,
        apiRoot: env.API_ROOT || '/api',
        baseUrl: env.BASE_URL || 'http://localhost:5000',
        storageProvider: env.STORAGE_PROVIDER || 'local',
        s3AccessKey: env.S3_ACCESS_KEY || '',
        s3AccessSecret: env.S3_ACCESS_SECRET || '',
        s3Bucket: env.S3_BUCKET || '',
        s3Region: env.S3_REGION || 'us-west-2',
        sampleHost: env.SAMPLE_HOST || 'us-cdbr-east-05.cleardb.net',
        samplePort: env.SAMPLE_PORT || 3306,
        sampleUser: env.SAMPLE_USER || 'b3855fb66306c5',
        samplePassword: env.SAMPLE_PASSWORD || 'c178fd7d',
        sampleDatabase: env.SAMPLE_DATABASE || 'heroku_8ffddfc8b5b4b8f',
        sampleConnection: env.SAMPLE_CONNECTION || 'Sample DB',
        mailjetApiKey: env.MAILJET_API_KEY || '6675e635447b4fdc1abf1a2371d68bdd',
        mailjetSecretKey: env.MAILJET_SECRET_KEY || 'db22335a87f99464c180c2c159befef1',
        mailjetSenderEmail: env.MAILJET_SENDER_EMAIL || 'surix@manuscript.ke',
        mailjetSenderName: env.MAILJET_SENDER_NAME || 'Surix',
        clientBaseUrl: env.CLIENT_BASE_URL || 'http://localhost:3000'
    };
};

const start = async () => {
    const config = loadConfig(process.env);
    const envMode = process.env.NODE_ENV || 'development';
    try {
        logger.info(`Starting app in ${envMode} mode...`);
        logger.info('Bootstrapping core services...');
        const eventBus = new EventEmitter();
        const dataSourceRegistry = new DataSourceRegistry;
        registerDataSources(dataSourceRegistry);
        const core = await bootstrapCore(config, eventBus, dataSourceRegistry);
        const expressServer = createServer();
        logger.info('Mounting REST API...');
        mountApi(expressServer, core, config);
        logger.info('REST API mounted on /api');
        await startServer(expressServer, config);
        logger.info('Server started on port', config.port);
        logger.info('App is ready');
    }
    catch (e) {
        logger.error('Application could not start: CODE', e.code, 'MESSAGE:', e.message);
        logger.error(e);
        process.exit(1);
    }
};

// start app
start();
export enum CoreMessage {
    ERROR_MAIN_DB_NOT_SPECIFIED = 'DB Manager has not specified Main DB',
    ERROR_DB_MANAGER_NOT_INITIALIZED = 'DB Manager has not been initialized',
    ERROR_DB_ID_INVALID = 'Provided ID is invalid for database',
    ERROR_USER_INSERT_FAILED = 'User could not be inserted to database',
    ERROR_ACCESS_TOKEN_INSERT_FAILED = 'Access token could not be inserted to database',
    ERROR_ENTITY_INSERT_FAILED = 'Entity could not be inserted in database',
    ERROR_ENTITY_DELETE_FAILED = 'Entity could not be deleted from the database',
    ERROR_ARGS_INVALID = 'Invalid arguments',
    ERROR_IDS_INVALID = 'Invalid type for ids',
    ERROR_USER_INDEXES_NOT_CREATED = 'Users indexes not created',
    ERROR_LOGIN_FAILED = 'Login failed',
    ERROR_ACCESS_TOKEN_INVALID = 'Access token is invalid',
    ERROR_ACCESS_TOKEN_REQUIRED = 'Access token is required',
    ERROR_PERMISSION_DENIED = 'Permission denied',
    ERROR_ENTITY_NOT_FOUND = 'Entity could not be found in database',
    ERROR_ENTITY_UPDATE_FAILED = 'Entity update failed',
    ERROR_ACCOUNT_NOT_FOUND = 'Account not found'
}
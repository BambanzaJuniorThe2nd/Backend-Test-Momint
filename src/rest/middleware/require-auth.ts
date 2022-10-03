import { ApiRequest, ApiResponse, ApiNextFunction } from '..';
import { CoreError, CoreMessage, ErrorCode, User } from '../../core';

/**
 * returns middleware to fetch authenticated user
 * if successful, adds the user to the request object
 * otherwise passes the error down the chain
 */
export const requireAuth = () =>
    (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
        const auth = req.get('Authorization');
        if (!auth) {
            const err = new CoreError(
                CoreMessage.ERROR_ACCESS_TOKEN_REQUIRED,
                ErrorCode.MISSING_AUTHENTICATION
            );
            return next(err);
        }

        verifyUserToken(auth, req, next);
    };


function verifyUserToken (auth: string, req: ApiRequest, next: ApiNextFunction) {
    req.core.users.getByToken(auth)
        .then((user: User) => {
            req.user = user;
            req.authContext = { _id: user._id, type: 'user' };
            next();
        })
        .catch(next);
}

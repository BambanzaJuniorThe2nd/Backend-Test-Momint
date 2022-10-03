import { CoreError, ErrorCode } from '../error';
import { CoreMessage } from '../messages';
import { randomBytes } from 'crypto';

/**
 * generates a random 64-character access token
 */
export const generateToken = async (): Promise<string> => {
    return randomBytes(64).toString('hex');
};

/**
 * checks whether input is a valid token
 * @param token token to verify
 * @deprecated We should remove this method,
 * we should consider a non-empty string valid
 * since tokens will be checked against the db anyway
 */
export const isToken = (token: string): boolean => {
    return typeof token === 'string' && token !== '';
};

/**
 * checks whether if provided arg is a valid id
 * and throws an error if it's not
 * @param id id to verify
 * @throws CoreError
 */
export const validateToken = (token: string) => {
    // for security reasons: to avoid users injecting arbitrary queries
    if (typeof token !== 'string' || !isToken(token))
        throw new CoreError(CoreMessage.ERROR_ACCESS_TOKEN_INVALID, ErrorCode.INVALID_ACCESS_TOKEN);
};

const tokenGenerator = { generateToken };

export { tokenGenerator };

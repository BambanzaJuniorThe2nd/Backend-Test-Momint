import { ValidatesUsers, UserGetNFTsByIdArgs, UserGetFeedByIdArgs } from '../types';
import { throwValidationError } from '..';
import { hasExactlyKeys, hasOnlyAllowedKeys, isNumber, validateId } from '../util';

export class UserValidator implements ValidatesUsers {
    validateGetNftsById(args: UserGetNFTsByIdArgs) {
        this.validateIdAndPaginationArgFields(args);
    }

    validateGetFeedById(args: UserGetFeedByIdArgs) {
        this.validateIdAndPaginationArgFields(args);
    }

    private validateIdAndPaginationArgFields(args: UserGetNFTsByIdArgs | UserGetFeedByIdArgs) {
        let allowedKeys: any[] = ['id', 'pagination'];

        if (!hasExactlyKeys(args, allowedKeys)) {
            throwValidationError('Invalid args');
        }

        const { id, pagination } = args;

        validateId(id);

        if (pagination) {
            allowedKeys = ['skip', 'limit'];
            if (!hasOnlyAllowedKeys(pagination, allowedKeys)) {
                throwValidationError('Invalid pagination args. Allowed fields: skip(number)');
            }

            const { skip, limit } = pagination;

            if ((skip && !isNumber(skip)) || (skip && isNumber(skip)) && skip < 0) {
                throwValidationError('Invalid skip value. Must be a number >= 0');
            }

            if ((limit && !isNumber(limit)) || (limit && isNumber(limit)) && limit <= 0) {
                throwValidationError('Invalid limit value. Must be a number > 0');
            }
        }
    }
}
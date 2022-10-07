import { ValidatesNFTs } from '../types';
import { hasExactlyKeys, hasOnlyAllowedKeys, isNumber, validateId } from '../util';

export class NFTValidator implements ValidatesNFTs {
    validateGetOwnerById(id: string) {
        validateId(id);
    }
}
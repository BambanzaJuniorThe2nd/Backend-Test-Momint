import { Router } from 'express';
import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from '..';
import { requireAuth } from '../middleware';

// 2 weeks
const DEFAULT_TOKEN_VALIDITY = 2 * 7 * 24 * 60 * 60;

export const users = Router();

users.get('/all', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    req.core.users.getAll()
        .then((users) => res.status(StatusCode.SUCCESS).send(users))
        .catch(next);
});

users.get('/:userid/nfts', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const args = { id: req.params.userid, pagination: req.body };
    req.core.users.getNftsById(args)
        .then((nfts) => res.status(StatusCode.SUCCESS).send(nfts))
        .catch(next);
});

users.get('/:userid/feed', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const args = { id: req.params.userid, pagination: req.body };
    req.core.users.getFeedById(args)
        .then((nfts) => res.status(StatusCode.SUCCESS).send(nfts))
        .catch(next);
});
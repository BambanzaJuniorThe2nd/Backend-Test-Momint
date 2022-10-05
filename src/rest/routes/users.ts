import { Router } from 'express';
import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from '..';
import { requireAuth } from '../middleware';

// 2 weeks
const DEFAULT_TOKEN_VALIDITY = 2 * 7 * 24 * 60 * 60;

export const users = Router();

users.get('/me', requireAuth(), (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    res.send(req.user);
});

users.get('/all', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    req.core.users.getAll()
        .then((users) => res.status(StatusCode.SUCCESS).send(users))
        .catch(next);
});

users.get('/:userid/nfts', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const id: string = req.params.userid;
    const limit: number = req.body.limit ? req.body.limit : 0;
    req.core.users.getAllNftsById(id, limit)
        .then((nfts) => res.status(StatusCode.SUCCESS).send(nfts))
        .catch(next);
});

users.get('/:userid/feed', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const id: string = req.params.userid;
    const limit: number = req.body.limit ? req.body.limit : 0;
    req.core.users.getFeedById(id, limit)
        .then((nfts) => res.status(StatusCode.SUCCESS).send(nfts))
        .catch(next);
});
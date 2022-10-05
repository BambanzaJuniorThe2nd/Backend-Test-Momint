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

users.get('/:id/nfts', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const id: string = req.params.id;
    const limit: number = req.body.limit ? req.body.limit : 0;
    req.core.users.getAllNftsByIdArgs(id, limit)
        .then((nfts) => res.status(StatusCode.SUCCESS).send(nfts))
        .catch(next);
});
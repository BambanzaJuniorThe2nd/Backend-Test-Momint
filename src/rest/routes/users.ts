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
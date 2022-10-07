import { Router } from 'express';
import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from '..';
import { requireAuth } from '../middleware';

export const nfts = Router();

nfts.get('/me', requireAuth(), (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    res.send(req.user);
});

nfts.get('/all', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    req.core.nfts.getAll()
        .then((nfts) => res.status(StatusCode.SUCCESS).send(nfts))
        .catch(next);
});

nfts.get('/:nftid/owner', (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const id = req.params.nftid;
    req.core.nfts.getOwnerById(req.params.id)
        .then((owner) => res.status(StatusCode.SUCCESS).send(owner))
        .catch(next);
});
import { Router, Request, Response } from 'express';
//import { deflate } from 'zlib';

import petsRoutes from './pets.route';

export const router = Router();

router.get('/', (req: Request, res: Response)=>{
    res.send("mukodik bazsd meg");
});

router.use('/pets', petsRoutes);

/**
 * List of routes that are not protected by JWT auth
 */
export const unprotected = [
    '/',
];

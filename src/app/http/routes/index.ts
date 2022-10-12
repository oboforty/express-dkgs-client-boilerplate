import { Router, Request, Response } from 'express';
//import { deflate } from 'zlib';

import petsRoutes from './pets.route';

const router = Router();

router.get('/', (req: Request, res: Response)=>{
    res.send("Tesomsz");
});

router.use('/pets', petsRoutes);

export default router;

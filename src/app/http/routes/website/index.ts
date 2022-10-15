import { Router, Request, Response } from 'express';

import petsRoutes from './pets.route';

export const router = Router();

router.get('/', (req: Request, res: Response)=>{
  res.render('index', {
    title: 'Home'
  });
});


router.use('/pets', petsRoutes);

/**
 * List of routes that are not protected by JWT auth
 */
export const unprotected = [
  '/'
];

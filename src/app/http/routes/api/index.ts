import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/', (req: Request, res: Response)=>{
  res.send("Api Index");
});


router.get('/proba', (req: Request, res: Response)=>{
  res.json({
    "hello": "tesomsz"
  })
});

/**
 * List of routes that are not protected by JWT auth
 */
export const unprotected = [
  '/api/v1'
];

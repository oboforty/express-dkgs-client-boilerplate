import { Router } from 'express';
//import { deflate } from 'zlib';
import petsController from '../../../domain/petstore/petsController';

const router = Router();

router.get('/', petsController.index);

router.post('/', petsController.create);


export default router;

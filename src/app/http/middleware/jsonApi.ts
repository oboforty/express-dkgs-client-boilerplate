import { Request, Response } from 'express';

export default function jsonApiMiddleWare(req: Request, res: Response, next: Function) {
  res.set('Content-Type', 'application/json');

  res.set('Access-Control-Allow-Origin', ['*']);
  res.set('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  return next();
};  

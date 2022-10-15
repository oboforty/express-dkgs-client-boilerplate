import { Request, Response } from 'express';

export default function adminGuardMiddleware(req: any, res: Response, next: Function) {
  // @TODO: @LATER: make this configurable?

  // use express-JWT request key
  if (req.auth && req.auth.admin)
    return next();
  else {
    res.status(403);
    throw new Error("Unauthorized: not admin account");
  }
};

import { NextFunction, Request, Response } from 'express';

const requireUser = (_req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send({ error: 'You must be logged in!' });
  }

  return next();
};

export default requireUser;

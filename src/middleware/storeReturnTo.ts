import { NextFunction, Request, Response } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    returnTo?: string;
  }
}
export const storeReturnTo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.returnTo = req.session.returnTo;
  next();
};

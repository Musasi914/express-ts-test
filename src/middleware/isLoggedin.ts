import { NextFunction, Request, Response } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    returnTo?: string;
  }
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "ログインしてください。");
    return res.redirect("/login");
  }
  next();
};

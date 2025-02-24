import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "ログインしてください。");
    return res.redirect("/login");
  }
  next();
};

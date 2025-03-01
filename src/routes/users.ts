import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import express from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import passport from "passport";
import { User } from "@prisma/client";
import { storeReturnTo } from "../middleware/storeReturnTo";

const router = express.Router();

router
  .route("/register")
  .get((req: Request, res: Response) => {
    res.render("users/register");
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const registeredUser = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "ユーザー登録完了");
        res.redirect("/campgrounds");
      });
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  });

router
  .route("/login")
  .get((req: Request, res: Response) => {
    res.render("users/login");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      // flashなど設定していないのであれば
      // successRedirect: '/'
      failureFlash: true,
      failureRedirect: "/login",
    }),
    (req: Request, res: Response) => {
      req.flash("success", `${(req.user as User).name} さんおかえり`);
      res.redirect(res.locals.returnTo || "/campgrounds");
    }
  );

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "ログアウトしました");
    res.redirect("/campgrounds");
  });
});

export { router };

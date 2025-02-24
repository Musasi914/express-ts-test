import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import express from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import passport from "passport";

const router = express.Router();

router
  .route("/register")
  .get((req: Request, res: Response) => {
    res.render("users/register");
  })
  .post(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      req.flash("success", "ユーザー登録完了");
      res.redirect("/campgrounds");
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
    passport.authenticate("local", {
      // flashなど設定していないのであれば
      // successRedirect: '/'
      failureFlash: true,
      failureRedirect: "/login",
    }),
    (req: Request, res: Response) => {
      req.flash("success", "おかえり");
      res.redirect("/campgrounds");
    }
  );

export { router };

import createError from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import expressLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { router as indexRouter } from "./routes/index";
import { router as campgroundsRouter } from "./routes/campgrounds";
import { router as usersRouter } from "./routes/users";

const app = express();

export const prisma = new PrismaClient();

// view engine setup
app.set("views", "views");
app.set("view engine", "ejs");
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
// express-session後に
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user)
          return done(null, false, { message: "ユーザーが見つかりません" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "パスワードが違います" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  try {
    done(null, (user as User).id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/campgrounds", campgroundsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "ページが見つかりませ"));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app };

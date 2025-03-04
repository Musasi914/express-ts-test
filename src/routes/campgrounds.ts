import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import express from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../app";
import { isLoggedIn } from "../middleware/isLoggedin";
import { storeReturnTo } from "../middleware/storeReturnTo";
import { User } from "@prisma/client";
import { isAuthor } from "../middleware/isAuthor";

const router = express.Router();

/* GET home page. */
router
  .route("/")
  .get(
    catchAsync(async (req: Request, res: Response) => {
      const data = await prisma.campgrounds.findMany({
        orderBy: {
          id: "asc",
        },
      });
      res.render("campgrounds/index", { data });
    })
  )
  .post(
    isLoggedIn,
    catchAsync(async (req: Request, res: Response) => {
      console.log(req.body);
      const { title, location, description, price } = req.body;
      if (req.user) {
        await prisma.campgrounds.create({
          data: {
            title,
            location,
            description,
            price: Number(price),
            user: { connect: { id: (req.user as User).id } },
          },
        });
      }
      req.flash("success", "キャンプ場を登録しました");
      res.redirect("/campgrounds");
    })
  );

router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req: Request, res: Response) => {
    res.render("campgrounds/new");
  })
);

router
  .route("/:id")
  .get(
    catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      if (Number.isNaN(Number(id))) {
        req.flash("error", "不明なキャンプ場です");
        return res.redirect("/campgrounds");
      }
      const data = await prisma.campgrounds.findUnique({
        where: { id: Number(id) },
        include: {
          reviews: {
            include: {
              user: true,
            },
          },
          user: true,
        },
      });
      if (!data) {
        req.flash("error", "不明なキャンプ場です");
        return res.redirect("/campgrounds");
      }
      res.render("campgrounds/view", {
        data,
        userId: req.user ? (req.user as User).id : null,
      });
    })
  )
  .put(
    isLoggedIn,
    isAuthor,
    catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { title, location, description, price } = req.body;
      const newCampgrounds = await prisma.campgrounds.update({
        where: { id: Number(id) },
        data: {
          title,
          location,
          price: Number(price),
          description,
        },
      });
      req.flash("success", "編集しました");
      res.redirect(`/campgrounds/${newCampgrounds.id}`);
    })
  )
  .delete(
    storeReturnTo,
    isLoggedIn,
    isAuthor,
    catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      await prisma.campgrounds.delete({
        where: { id: Number(id) },
      });
      req.flash("success", "キャンプ場を削除しました");
      res.redirect("/campgrounds");
    })
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await prisma.campgrounds.findUnique({
      where: { id: Number(id) },
    });
    if (!data) {
      req.flash("error", "キャンプ場が見つかりませんでした");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { data });
  })
);

router.post(
  "/:id/reviews",
  isLoggedIn,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { body, rating } = req.body;
    if (Number(rating) < 1 || Number(rating) > 5) {
      return createError(400, "不正な値です");
    }
    if (!req.user) return createError(400, "ログインして"); //isLoggedInでこれはカバーされているが、TSエラーになるので
    await prisma.review.create({
      data: {
        body,
        rating: Number(rating),
        campgrounds: {
          connect: { id: Number(id) },
        },
        user: {
          connect: { id: (req.user as User).id },
        },
      },
    });
    req.flash("success", "レビューを登録しました");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, reviewId } = req.params;
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
    });
    if (!req.user || review?.userId !== (req.user as User).id) {
      req.flash("error", "そのアクションの権限がないです");
      return res.redirect(`/campgrounds/${id}`);
    }
    await prisma.review.delete({
      where: {
        id: Number(reviewId),
        campgrounds: { id: Number(id) },
      },
    });
    req.flash("success", "レビューを削除しました");
    res.redirect(`/campgrounds/${id}`);
  })
);

export { router };

import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import express from "express";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

const prisma = new PrismaClient();

/* GET home page. */
router.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const data = await prisma.campgrounds.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.render("campgrounds/index", { data });
  })
);
router.post(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const { title, location, description } = req.body;
    await prisma.campgrounds.create({
      data: { title, location, description },
    });
    res.redirect("/campgrounds");
  })
);

router.get(
  "/new",
  catchAsync(async (req: Request, res: Response) => {
    res.render("campgrounds/new");
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await prisma.campgrounds.findUnique({
      where: { id: Number(id) },
    });
    res.render("campgrounds/edit", { data });
  })
);

router.get(
  "/:id",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await prisma.campgrounds.findUnique({
      where: { id: Number(id) },
    });
    res.render("campgrounds/view", { data });
  })
);

router.put(
  "/:id",
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
    res.redirect(`/campgrounds/${newCampgrounds.id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.campgrounds.delete({
      where: { id: Number(id) },
    });
    res.redirect("/campgrounds");
  })
);

export { router };

import { NextFunction, Request, Response } from "express";
import { prisma } from "../app";
import { User } from "@prisma/client";

export const isAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const campground = await prisma.campgrounds.findUnique({
    where: { id: Number(id) },
    select: { userId: true },
  });
  if (!campground) {
    req.flash("error", "キャンプ場が見つからない");
    return res.redirect("/campgrounds");
  }
  if (campground.userId !== (req.user as User).id) {
    req.flash("error", "キャンプ場を編集する権限がない");
    return res.redirect(`/campgrounds/${id}`);
  }
};

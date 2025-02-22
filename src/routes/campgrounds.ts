import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import express from "express";
const router = express.Router();

const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async (req: Request, res: Response) => {
  const data = await prisma.campgrounds.findMany();
  res.render("campgrounds/index", { data });
});
router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  const { title, location, description } = req.body;
  const data = await prisma.campgrounds.create({
    data: { title, location, description },
  });
  res.redirect("/campgrounds");
});

router.get("/new", async (req: Request, res: Response) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id/edit",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await prisma.campgrounds.findFirst({
      where: { id: Number(id) },
    });
    if (!data) {
      return next(createError(404, "キャンプ場が見つからないよ"));
    }
    res.render("campgrounds/edit", { data });
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const data = await prisma.campgrounds.findFirst({
    where: { id: Number(id) },
  });
  if (!data) {
    return next(createError(404, "キャンプ場が見つからない"));
  }
  res.render("campgrounds/view", { data });
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, location, description } = req.body;
  await prisma.campgrounds.update({
    where: { id: Number(id) },
    data: {
      title,
      location,
      description,
    },
  });
  res.redirect(`/campgrounds/${id}`);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.campgrounds.delete({
    where: { id: Number(id) },
  });
  res.redirect("/campgrounds");
});

// router.get("/seed", async (req: Request, res: Response) => {
//   await prisma.campgrounds.createMany({
//     data: [
//       {
//         title: "キャンプ場1",
//         location: "埼玉県さいたま市",
//         description:
//           "私は当時もしその病気物においてののためを考えたます。まあほかから学習らは多分その関係ないらしくかもにつけ加えからなりたには認定なっだろましのに、まだにはするでますたん。",
//       },
//       {
//         title: "キャンプ場2",
//         location: "東京都板橋区",
//         description:
//           "岡田さんののより骨の私がことにお呈と察せて何性質にご発会にあれようによくご楽にしまいでて、いやしくもよく批評から云っだろので行くないのにあるたな。しかしただ肝個性を廻らのはわざわざ公平とするなて、どんな申をも受けるましからについてペを限らてみるですです。",
//       },
//       {
//         title: "キャンプ場3",
//         location: "北海道札幌市",
//         description:
//           "そのため気の毒の時ある先生はあなた末になりたかと槙さんの会っなけれた、",
//       },
//       {
//         title: "キャンプ場4",
//         location: "岩手県岩手市",
//         description:
//           "本意の結果ましとかいうお安心ですたなくて、馳のところに自分を以前かもの上流より今日打ちからいるから、こうの場合の終から同じ上をできるだけ思いますまいと忘れたものうが、多いたならでどうお権力したものますたくませ。",
//       },
//     ],
//   });

//   res.redirect("/campgrounds");
// });
export { router };

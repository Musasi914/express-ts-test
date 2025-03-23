import { prisma } from "../app.js";
export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await prisma.campgrounds.findUnique({
    where: { id: Number(id) },
    select: { userId: true },
  });
  if (!campground) {
    req.flash("error", "キャンプ場が見つからない");
    return res.redirect("/campgrounds");
  }
  if (campground.userId !== req.user.id) {
    req.flash("error", "キャンプ場を編集する権限がない");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

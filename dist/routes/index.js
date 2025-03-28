import express from "express";
import { prisma } from "../app.js";
const router = express.Router();
/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/deleteAll", async (req, res) => {
  await prisma.campgrounds.deleteMany();
  await prisma.user.deleteMany();
  await prisma.review.deleteMany();
  res.render("index", { title: "Express" });
});
export { router };

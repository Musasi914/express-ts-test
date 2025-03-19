import express from "express";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import passport from "passport";
import { storeReturnTo } from "../middleware/storeReturnTo";
const router = express.Router();
router
    .route("/register")
    .get((req, res) => {
    res.render("users/register");
})
    .post(async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const registeredUser = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });
        req.login(registeredUser, (err) => {
            if (err)
                return next(err);
            req.flash("success", "ユーザー登録完了");
            res.redirect("/campgrounds");
        });
    }
    catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
});
router
    .route("/login")
    .get((req, res) => {
    res.render("users/login");
})
    .post(storeReturnTo, passport.authenticate("local", {
    // flashなど設定していないのであれば
    // successRedirect: '/'
    failureFlash: true,
    failureRedirect: "/login",
}), (req, res) => {
    req.flash("success", `${req.user.name} さんおかえり`);
    res.redirect(res.locals.returnTo || "/campgrounds");
});
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "ログアウトしました");
        res.redirect("/campgrounds");
    });
});
export { router };

export const storeReturnTo = (req, res, next) => {
    res.locals.returnTo = req.session.returnTo;
    next();
};

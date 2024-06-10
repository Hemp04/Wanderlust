const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");
router.get("/signup", userController.signupGet);

router.post("/signup", wrapAsync(userController.signupPost));

router.get("/login", userController.loginGet);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginPost
);

router.get("/logout", userController.logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsynch = require("../utils/WrapAsynch.js");
const passport = require("passport");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//SignUp User
router
  .route("/signUp")
  .get(userController.renderSignUpForm)
  .post(WrapAsynch(userController.signUp));

//Login User *

router
  .route("/login")
  .get(userController.renderLogInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logIn
  );

//Logout
router.get("/logout", userController.logOut);
module.exports = router;

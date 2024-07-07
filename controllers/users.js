const User = require("../models/user.js");



module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signUp.ejs");
  }


module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (error) => {
        if (error) {
          return next(error);
        }
        req.flash("success", "Welcome to WanderLust :)");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("failure", e.message);
      res.redirect("/signUp");
    }
  }


  module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome to wanderLust:)");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logOut = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "logged you out successfully!");
      res.redirect("/listings");
    });
  }
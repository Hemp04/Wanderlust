// const flash = require("connect-flash");
const User = require("../models/user");
module.exports.signupGet = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.signupPost = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
module.exports.loginGet = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.loginPost = async (req, res) => {
  req.flash("success", "Welcome to wanderlust! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out ");
    res.redirect("/listings");
  });
};

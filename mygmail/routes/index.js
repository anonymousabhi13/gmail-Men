var express = require("express");
const passport = require("passport");
const Users = require("./users");
const Mails = require("./mails");
const { populate } = require("./mails");
var router = express.Router();
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(Users.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("register");
});

router.get("/sentmails", isLoggedIn, function (req, res, next) {
  Users.find({ username: req.session.passport.user })
    .populate({
      path: "sentMails", // populate mails
      // populate: {
      //   path: "userid", // populate userid
      // },
    })
    .then((data) => {
      console.log(data.email );
      res.render("allmails", { data: data });
    });
});

router.get("/allusers", isLoggedIn, function (req, res, next) {
  res.render("alluser");
});

router.get("/compose", isLoggedIn, function (req, res, next) {
  res.render("compose");
});

router.post("/compose", isLoggedIn, async function (req, res, next) {
  const loggedInUser = await Users.findOne({
    username: req.session.passport.user,
  });

  // console.log("User Logged IN: " + loggedInUser);
  const createData = await Mails.create({
    userid: loggedInUser._id,
    receiver: req.body.receiveremail,
    mailtext: req.body.mailtext,
  });
// console.log(loggedInUser._id)
  loggedInUser.sentMails.push(createData._id);
  const liud = await loggedInUser.save();

  const receiverUser = await Users.findOne({
    receiver: req.body.receiveremail,
  });
  // console.log(receiverUser);
  receiverUser.receiveMails.push(loggedInUser._id);
  const ruid = await receiverUser.save();

  res.redirect("/home");
});
//home route

router.get("/home", isLoggedIn, function (req, res, next) {
  res.render("home", { user: req.user.username });
  // res.send(req.session.passport.user);
});

//register route

router.get("/register", function (req, res, next) {
  res.render("register");
});

//login route

router.get("/login", function (req, res) {
  res.render("login");
});

//post register route

router.post("/register", function (req, res) {
  var newUser = new Users({
    username: req.body.username,
    email: req.body.email,
    Number: req.body.Number,
    gender: req.body.gender,
  });

  Users.register(newUser, req.body.password)
    .then(function (user) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("home");
        console.log(user.username, user.email);
      });
    })
    .catch(function (err) {
      res.send(err.message);
    });
});

//post login route

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//login middleware check route
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("You are not logged in");
}

//logout route

router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) throw err;
    res.redirect("/login");
  });
});

module.exports = router;

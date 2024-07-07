if(process.env.NODE_ENV != "Production"){
  require('dotenv').config()
}
// console.log(process.env)

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/WrapAsynch.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const router = express.Router();
const reviewRouter = require("./routes/reviews.js");
const listingRouter = require("./routes/listings.js");
const userRouter = require("./routes/users.js");
const {isLoggedin} = require("./middleware.js");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views");
app.set("views/listings");
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static("public"));


main()
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));
 
async function main() {
  let dburl = process.env.ATLASDB_URL ;
  await mongoose.connect(dburl);
}

const store = MongoStore.create({
  mongoUrl :process.env.ATLASDB_URL ,
  crypto :{
    secret :process.env.SECRET
  },
  touchAfter : 24*60*60
})

store.on("error",()=>{
  console.log("error in mongo session store",error);
})
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//index route
// app.get("/", (req, res) => {
//   res.send("Hi , I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currentUser = req.user;

  next();
});

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  // let {statusCode=500,message="Something went wrong"}=err;
  // res.status(statusCode).send(message);
  res.render("./listings/error.ejs", { err });
});

//creating and requesting ang getting responses to localhost server port 8080
app.listen(8080, () => {
  console.log(`listening to port 8080`);
});

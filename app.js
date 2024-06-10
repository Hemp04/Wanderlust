if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const { log } = require("console");
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //req.params thi data lai shakay ena mate aa lakhvu jaruri chhe....
app.use(methodOverride("_method"));
app.engine("ejs", ejs_mate);
app.use(express.static(path.join(__dirname, "/public")));
// Additional configuration to serve CSS with correct MIME type
// app.get("/", (req, res) => {
//   res.send("HI ,I am root!!");
// });
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async (req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });
//   let registeredUser=await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);

// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
  // console.log(res.locals.currUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.use(
//   "/css",
//   express.static(path.join(__dirname, "css"), {
//     setHeaders: (res, path) => {
//       if (path.endsWith(".css")) {
//         res.setHeader("Content-Type", "text/css");
//       }
//     },
//   })
// );

// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);

//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg.error);
//   } else {
//     next();
//   }
// };

// // index route
// app.get(
// "/listings",
// wrapAsync(async (req, res) => {
//   const allListing = await Listing.find({});
//   res.render("listings/index.ejs", { allListing });
//   // .then((res)=>{console.log(res); })//here it will get all result
// })
// );

// // New route
// app.get("/listings/new", (req, res) => {
// res.render("listings/new.ejs");
// });
// // edit route
// app.get(
// "/listings/:id/edit",
// wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// })
// );

// // create route
// app.post(
// "/listings",
// validateListing,
// wrapAsync(async (req, res, next) => {
//   if (!req.body.listing) {
//     throw new ExpressError(400, "Send valid data for listing");
//   }
//   // let {title,description,image,price,country,location}=req.body;//we can get  all values either these way without doing anything  // but another way is to pass key pairs as we have done
//   const newListing = new Listing(req.body.listing);
//   // if(!newListing.title){
//   //   throw new ExpressError(400,"Title is missing!");
//   // }
//   // if(!newListing.description){
//   //   throw new ExpressError(400,"description is missing!");
//   // }
//   let result = listingSchema.validate(req.body);
//   console.log(result);
//   if (result.error) {
//     throw new ExpressError(400, result.error);
//   }
//   await newListing.save();
//   // req.flash("success","New Listing")
//   res.redirect("/listings");
// })
// );

// // deleted route
// app.delete(
// "/listings/:id",
// validateListing,
// wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings/index.ejs");
// })
// );

// // show route
// app.get(
// "/listings/:id",
// // validateListing,
// wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   // console.log(listing); // const rev=await Review.findById(id  );// console.log(rev);
//   res.render("listings/show.ejs", { listing });
// })
// );

// // update route
// app.put(
// "/listings/:id",
// validateListing,
// wrapAsync(async (req, res) => {
//   // if (!req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing");
//   // }
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// })
// );

// app.get("/testlisting", async(req,res)=>{//     let sampleListing=new Listing({//         title:"My New Villa",//         description:"By thr Beach",//         price:1200,//         location:"Calangute,Goa",//         country:"India",//     });
//     await sampleListing.save();//doubt:- solved it is to save things in database and if there is any delay so that async await is used here
//     console.log("Sample was saved");//     res.send("successfull testing");// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  // res.send("something went wrong occured")
  let { statusCode = 500, message = "something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

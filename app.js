// 1. Imports
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// 2. Routers
const listingsRouter = require("./routes/listing");
const userRouter = require("./routes/user.js");

// 3. Database URL
const dbUrl = process.env.MONGO_URL || process.env.ATLAS_URL;
if (!dbUrl) {
  console.error("❌ No MongoDB URL found. Check environment variables.");
  process.exit(1);
}

// 4. Database Connection
mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// 5. View Engine & Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 6. Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET || "defaultsecret" },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => console.log("❌ SESSION STORE ERROR:", err));

const sessionOptions = {
  store,
  secret: process.env.SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// 7. Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 8. Global Locals for Flash Messages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// 9. Mount Routers
app.use("/listings", listingsRouter);
app.use("/", userRouter);


// 10. Health Route for Render
app.get("/_health", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).send(err.message);
});

// 12. Start Server
const PORT = process.env.PORT || 3000;
const listEndpoints = require("express-list-endpoints");
console.log("🧩 Registered routes:");
console.log(listEndpoints(app));
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

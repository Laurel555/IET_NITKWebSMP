const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");
// -----DATABASE SET-UP-------
const mongo_uri = process.env.mongo_uri;
const connect = mongoose.connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
connect.then(
    (db) => {
        console.log("Database Connected Successfully");

    },
    (err) => {
        console.log("Error occur while connecting", err);
    }
);

//------ General Configuration--------
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//------ Routers----------
const commentRoutes = require("./routes/comment");
const postRoutes = require("./routes/post");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
//--------PASSPORT CONFIGURATION---------
app.use(
    require("express-session")({
        secret: "I am the best",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Get Current logged User
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/user", userRoutes);
app.listen(3000, function() {
    console.log('Server started at port 3000');
});
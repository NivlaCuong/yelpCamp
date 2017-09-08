var express                 = require("express"),
    request                 = require("request"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    flash                   = require("connect-flash"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seeds"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    User                    = require("./models/user");

var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    indexRoutes              = require("./routes/index");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp");

// seedDB(); // seed the database

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret:"I am a great person",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp Camp Server started");
})

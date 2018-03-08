var express     = require("express"),
    passport    = require("passport"),
    User        = require("../models/user"),
    router      = express.Router();

router.get("/", function(req, res) {
    res.render("landing");
});

// show sign up form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handling User Sign up
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    });
});

// Log in Form
router.get("/login", function(req, res) {
    res.render("login");
})

// Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect("/campgrounds");
});

module.exports = router;

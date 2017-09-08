var middlewareObj   = {},
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground) {
                req.flash("error", "Sorry, that campground does not exist!");
                res.redirect("/campgrounds");
            } else if(foundCampground.author.id.equals(req.user.id) || req.user.isAdmin) {
                req.campground = foundCampground;
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.render("login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.commentId, function(err, foundComment){
            if (err || !foundComment) {
                req.flash("error", "Sorry, this comment does not exist!");
                return res.redirect("back");
            } else if(foundComment.author.id.equals(req.user.id) || req.user.isAdmin) {
                req.comment = foundComment;
                next();
            } else {
                req.flash("error", "You need to be logged in to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.render("login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) return next();
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};
module.exports = middlewareObj;
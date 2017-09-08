var express     = require("express"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware"),
    router      = express.Router({mergeParams: true});
    
// ===================
// COMMENTS ROUTES
// ===================

// Comment New Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    })
});

// Create Comment - Add a comment to our db
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            res.redirect("/campgorunds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!!!");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })      
        }
    })
});

// Edit comment form
router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req,res){
    res.render("comments/edit", {campgroundId: req.params.id, comment: req.comment});
});

// Update Route
router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Updated!!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// Destroy campground route
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted a comment!!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

module.exports = router;
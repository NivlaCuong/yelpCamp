var express     = require("express"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware"),
    router      = express.Router();
    
//INDEX - Show all Campground
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
})

//NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
}) 

//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name            = req.body.name,
        image           = req.body.image,
        price           = req.body.price,
        desc            = req.body.description;
    
    var author          = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground   = {
        name: name, 
        image: image,
        price: price,
        description: desc,
        author: author
    };
    
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - show more info about 1 campground
router.get("/:id", function(req, res) {
    //Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err || !foundCampground) {
            req.flash("error", "Sorry, that campground does not exist!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", {campground: foundCampground});      
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    res.render("campgrounds/edit", {campground: req.campground});
});

// Update Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;
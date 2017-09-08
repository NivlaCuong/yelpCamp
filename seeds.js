var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    data        = [
        {
            name: "Pic 1",
            image: "https://static.pexels.com/photos/20974/pexels-photo.jpg",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        },
        {
            name: "Pic 2",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_hBhqDSY-5AM6yOnPGRYYl8cP2Z3J-6w57QWPS3L0FQtTA1J9",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        },
        {
            name: "Pic 3",
            image: "http://images.all-free-download.com/images/graphiclarge/water_waterfall_nature_214751.jpg",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        }
    ];
function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } 
        console.log(("removed campground"));
        
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added Campground");
                    Comment.create(
                        {
                            text: "this place is great, would come here again",
                            author: "Calvin"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created a new Comment");
                            }
                        });
                }
            })   
        });
    });
}

module.exports = seedDB;
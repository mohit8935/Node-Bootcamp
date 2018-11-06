var express = require("express");
var router =  express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");



router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    var campground_id = req.params.id
    Campground.findById(campground_id,function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn,function(req,res){
    var campground_id = req.params.id
    console.log(campground_id)
    Campground.findById(req.params.id,function(err, campground){
        if (err){
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            newComment = req.body.comment
            Comment.create(newComment, function(err, newlycomment)
            {
                if(err){
                    console.log(err);
                    console.log("Error")
                }
                    campground.comments.push(newlycomment);
                    campground.save();
                    console.log(campground._id);
                    res.redirect('/campgrounds/' + campground._id);
            }); 
        }
    
    });
}); 

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else
    res.redirect("/login")
}

module.exports = router;
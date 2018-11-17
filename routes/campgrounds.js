var express = require("express");
var router =  express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment")
router.get("/campgrounds", function(req,res){

    console.log(req.user);
   //get all campgrounds from db
   Campground.find({}, function(err,allcampgrounds){
    if (err){
        console.log(err)
    }else {
        res.render("campgrounds/index", {campgrounds:allcampgrounds, currentUser: req.user});
    }
   }); 
    

});

router.get("/campgrounds/new", isLoggedIn,function(req,res){
    res.render("campgrounds/new.ejs");
});
router.post("/campgrounds/", isLoggedIn,function(req,res){

    var name =  req.body.name;
    var image = req.body.image;
    var description =  req.body.description;
    var newCampground = new Campground({name: name, image: image, description: description});
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err)
        } else {
            newCampground.author.id = req.user._id;
            newCampground.author.username = req.user.username;
            newCampground.save();
            res.redirect("/campgrounds");
        }
    });
    
    // adding data to campgrounds array
    // redirecting back to campgrounds.page
});

router.get("/campgrounds/:id", function (req,res) {
    var campground_id = req.params.id
    console.log(campground_id)
    Campground.findById(campground_id).populate("comments").exec(function (err, foundCampground){
        if(err){console.log(err)}
        else{
            res.render("campgrounds/show", 
      {campground:foundCampground});
        }
    });    
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else
    req.session.returnTo = req.originalUrl; 
    console.log(req.session.returnTo)
    res.redirect("/login")
}
module.exports = router;
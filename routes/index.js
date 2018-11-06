var express = require("express");
var router =  express.Router();
var passport = require("passport");
var User =  require("../models/user");
router.get("/", function(req,res){
    res.render("landing")
});

router.get("/register", function(req,res){
    res.render("register");

});

router.post("/register", function(req,res){
    var newUser =  new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds")
        });
    });

});

router.get("/login",function (req,res){
    res.render("login")
});

router.post("/login", passport.authenticate("local", 
{
    failureFlash: 'Invalid username or password.' 
}),function(req,res){
    res.redirect(req.session.returnTo || '/');
    console.log(req.session);
    delete req.session.returnTo;
    console.log(req.session);
    console.log(req.session.returnTo);

});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else
    req.session.returnTo = req.originalUrl; 
    console.log(req.session.returnTo)
    res.redirect("/login")
}
router.get("/logout", function(req,res){
    req.logOut();
    res.redirect("/campgrounds");
})

module.exports = router;
var express         = require("express"),
    app             =  express(),
    mongoose        = require('mongoose'),
    bodyParser      = require("body-parser")
    Campground      = require("./models/campground")
    Comment         = require("./models/comment")
    seedDB          = require("./seeds")
    passport        = require("passport")
    LocalStrategy   = require("passport-local")
    User            = require("./models/user")


seedDB();
mongoose.connect('mongodb://localhost/campground')
app.use(express.static(__dirname+"/public"))
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//======Passport Configuration=======//
app.use(require("express-session")({
    secret: "Mohit Nihalani is best",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================================//

const port = 3000

// using bodyparser with Express
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("landing")
});
app.get("/campgrounds", function(req,res){
   //get all campgrounds from db
   Campground.find({}, function(err,allcampgrounds){
    if (err){
        console.log(err)
    }else {
        res.render("campgrounds/index", {campgrounds:allcampgrounds});
    }
   }); 
    

});
app.listen(port, function(){
    console.log("The bootcamp server has started")
});


app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new.ejs");
});
app.post("/campgrounds", function(req,res){

    var name =  req.body.name;
    var image = req.body.image;
    var description =  req.body.description
    var newCampground = new Campground({name: name, image: image, description: description});
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    });
    
    // adding data to campgrounds array
    // redirecting back to campgrounds.page
});

app.get("/campgrounds/:id", function (req,res) {
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

app.get("/campgrounds/:id/comments/new", function(req,res){
    var campground_id = req.params.id
    Campground.findById(campground_id,function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
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

//=============Authentication Routes===============//
app.get("/register", function(req,res){
    res.render("register");

});

app.post("/register", function(req,res){
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

app.get("/login",function (req,res){
    res.render("login")
});

app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

}),function(req,res){

});

app.get("/logout", function(req,res){
    req.logOut();
    res.redirect("/campgrounds");
})
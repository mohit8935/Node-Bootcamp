var express     = require("express"),
    app         =  express(),
    mongoose    = require('mongoose'),
    bodyParser  = require("body-parser")

mongoose.connect('mongodb://localhost/campground')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// NEW SCHEMA

var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground",campgroundsSchema);



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
        res.render("campgrounds", {campgrounds:allcampgrounds});
    }
   }); 
    

});
app.listen(port, function(){
    console.log("The bootcamp server has started")
});


app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});
app.post("/campgrounds", function(req,res){

    var name =  req.body.name;
    var image = req.body.image;
    var newCampground = new Campground({name: name, image: image});
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
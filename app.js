var express     = require("express"),
    app         =  express(),
    mongoose    = require('mongoose'),
    bodyParser  = require("body-parser")
    Campground  = require("./models/campground")

mongoose.connect('mongodb://localhost/campground')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});



/* campground1 = new Campground({name: "Salmon Creek", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f1c070a1e4b5be_340.jpg", description: "Salmon Creek is located in southwestern Clark County at 45°42′18″N 122°39′41″W (45.704938, -122.661300).[4] It is bordered to the northeast by Mount Vista, to the east by Barberton, to the southeast by Walnut Grove, to the south by Hazel Dell, to the southwest by Lake Shore, and to the west by Felida. Downtown Vancouver is 6 miles (10 km) to the south. According to the United States Census Bureau, the Salmon Creek CDP has a total area of 6.3 square miles (16.4 km2), all of it land"});
Campground.create(campground1, function(err, newlycreated){
    if(err){
        console.log(err)
    } else {
        console.log("added");
    }
});
campground2 = new Campground({name: "Mountain Hill", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f1c070a1e4b5be_340.jpg", description: "A mountain is a large landform that rises above the surrounding land in a limited area, usually in the form of a peak. A mountain is generally steeper than a hill. Mountains are formed through tectonic forces or volcanism. ... A few mountains are isolated summits, but most occur in huge mountain ranges."});
Campground.create(campground2, function(err, newlycreated){
    if(err){
        console.log(err)
    } else {
        console.log("added");
    }
}); */


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
        res.render("index", {campgrounds:allcampgrounds});
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
    Campground
    .findOne({_id: req.params.id}, function (err, foundCampground){
      res.render("show", 
      {campground:foundCampground});
      
        
    }); 
    
});
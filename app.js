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

var commentRoutes = require("./routes/comments"), 
campgroundsRoutes = require("./routes/campgrounds"),
indexRoutes          = require("./routes/index");
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

app.use(function(req,res,next){
    res.locals.currentUser =  req.user;
    next();
}); 
//==================================//

const port = 3000

// using bodyparser with Express
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundsRoutes);
app.listen(port, function(){
    console.log("The bootcamp server has started")
});

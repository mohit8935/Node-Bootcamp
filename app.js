var express = require("express")
var app =  express();
const port = 3000

app.set("view engine", "ejs");
app.get("/", function(req,res){
    res.render("landing")
});
app.get("/campgrounds", function(req,res){
    var campgrounds = [
        {name: "James Bond", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f1c078a5eeb5b0_340.jpg"},
        {name: "Granite Hill", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144594f1c07ba4edbd_340.jpg"}
    ]
    res.render("campgrounds", {campgrounds:campgrounds});

});
app.listen(port, function(){
    console.log("The bootcamp server has started")
});
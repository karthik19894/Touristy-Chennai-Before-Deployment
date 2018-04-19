var express=require("express");
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/touristychennaiv3");
var Campground=require('./models/campground');
var seedDB=require('./seed');




app.use(bodyParser.urlencoded({extended:true}));



app.set("view engine","ejs");

seedDB();

app.get('/',function(req,res){
    res.render("landing");
});


app.get('/campgrounds',function(req,res){
    Campground.find({},function(err,campgrounds){
    if(err){
        console.log("Error in fetching Camp grounds");
    }
    else
    {
        res.render('index',{campgrounds:campgrounds});
    }
    
})
});


app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var campground={name:name,image:image,description:desc};
    Campground.create(campground,function(err,campground)
    {
        if(err){
            console.log(err);
        }
        else
        {
            console.log("campground created successfully");
            res.redirect('/campgrounds');
        }
    });
    
    
});

app.get('/campgrounds/new',function(req,res)
{
    res.render('newcampground');
});

app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


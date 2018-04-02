var express=require("express");
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost/touristychennai");

var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String
});

var Campground=mongoose.model("Campground",campgroundSchema);


app.set("view engine","ejs");

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
        res.render('campgrounds',{campgrounds:campgrounds});
    }
    
})
});


app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var campground={name:name,image:image};
    Campground.create(campground,function(err,campground)
    {
        if(err){
            console.log(err);
        }
        else
        {
            console.log("campground created successfully");
            res.redirect('campgrounds');
        }
    });
    
    
});

app.get('/campgrounds/new',function(req,res)
{
    res.render('newcampground');
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


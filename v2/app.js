var express=require("express");
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost/touristychennai");

var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground=mongoose.model("Campground",campgroundSchema);


app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render("landing");
});

Campground.create({name:"Bessy Beach",image:"https://media.gettyimages.com/photos/good-morning-chennai-picture-id169401579",description:"An awesome beach located in one of the Calmest Places in Chennai "},function(err,place){
    if(err){
        console.log(err)
    }
    else
    {
        console.log("Place Created Successfully");
    }
});

Campground.create({name:"Marina Beach",image:"https://media.gettyimages.com/photos/marina-beach-picture-id169352317",description:"No words to Say and the 2nd longest beach in the World "},function(err,place){
    if(err){
        console.log(err)
    }
    else
    {
        console.log("Place Created Successfully");
    }
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
            res.redirect('campgrounds');
        }
    });
    
    
});

app.get('/campgrounds/new',function(req,res)
{
    res.render('newcampground');
});

app.get('/campgrounds/:id',function(req,res){
    var id=req.params.id;
    Campground.findById(id,function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render('show',{campground:foundCampground});
            
        }
    });
    
    
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


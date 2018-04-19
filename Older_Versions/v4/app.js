var express=require("express");
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/touristychennaiv3");
var Campground=require('./models/campground');
var Comment=require('./models/comment');
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
        res.render('campgrounds/index',{campgrounds:campgrounds});
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
            console.log("Campground created successfully");
            res.redirect('/campgrounds');
        }
    });
    
    
});

app.get('/campgrounds/new',function(req,res)
{
    res.render('campgrounds/newcampground');
});

app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

app.get('/campgrounds/:id/comments/new',function(req,res){
    var id=req.params.id;
    Campground.findById(id,function(err,campground){
        if(err){
            console.log(err);
        }
        else
        {
            res.render('comments/new',{campground:campground});
        }
    })
});

app.post('/campgrounds/:id/comments',function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        Comment.create(req.body.comment,function(err,comment){
            if(err){
                console.log(err);
            }
            else
            {
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/'+campground._id);
            }
        })
    });
    //Create new comment
    //Connect new comment to campground
    //Redirect to campground show page
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


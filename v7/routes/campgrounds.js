var express=require('express'),
router=express.router(),
Campground=require('../models/campground');


router.get('/',function(req,res){
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


router.post('/',function(req,res){
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

router.get('/new',function(req,res)
{
    res.render('campgrounds/newcampground');
});

router.get("/:id", function(req, res){
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}
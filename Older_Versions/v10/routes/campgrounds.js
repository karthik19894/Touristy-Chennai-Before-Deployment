var express=require('express'),
router=express.Router(),
Campground=require('../models/campground');

var middleware=require('../middleware');


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


router.post('/',middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={id:req.user._id,username:req.user.username}
    var campground={name:name,image:image,description:desc,author:author};
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

router.get('/new',middleware.isLoggedIn,function(req,res)
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

//Edit Routes

router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){
   Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err);
       }
       else
       {
           res.render("campgrounds/edit",{campground:foundCampground});
       }
   }) 
});

router.put('/:id',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundCampground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds')
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})

//Destroy Routes

router.delete('/:id/delete',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/campgrounds');
    })    
});





module.exports = router;
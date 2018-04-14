var express=require('express'),
router=express.router({mergeParams:true}),
Campground=require('../models/campground'),
Comment=require('../models/comment');

router.get('/new',isLoggedIn,function(req,res){
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

router.post('/',isLoggedIn,function(req,res){
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
    
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}
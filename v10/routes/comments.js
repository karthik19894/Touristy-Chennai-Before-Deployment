var express=require('express'),
router=express.Router({mergeParams:true}),
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
                comment.author.id=req.user._id;
                comment.author.username=req.user.username;
                comment.save()
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/'+campground._id);
            }
        })
    });
    
});

//Edit and Update Routes For Comments

router.get('/:comment_id/edit',checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
        }
        res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
    })
    
});

router.put('/:comment_id',checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
});

//Comments Destroy Route

router.delete('/:comment_id/delete',checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/campgrounds/'+req.params.id)
    })
});

function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                console.log(err);
            }
        else{
               if(foundComment.author.id.equals(req.user._id)){
            next();
            
                }
                else{
            res.redirect('back');
                }
        
        }
     
    });
    
}
else{
    res.redirect('back');
}
}


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

module.exports = router;
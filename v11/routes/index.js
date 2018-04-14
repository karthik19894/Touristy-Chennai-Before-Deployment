var express=require('express'),
router=express.Router(),
Campground=require('../models/campground'),
User=require('../models/user'),
passport=require('passport');


router.get('/',function(req,res){
    res.render("landing");
});
//AUTH ROUTES

//Show the register form

router.get('/register',function(req,res){
    res.render('register');
});

router.post('/register',function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(err,user){
            res.redirect('/campgrounds');
            req.flash("success", "Welcome to YelpCamp " + user.username);
        
    });
});
});
//show login form

router.get('/login',function(req,res){
    res.render('login');
});

//posting login

router.post('/login',passport.authenticate("local",{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'}),function(req,res){
    
});

//LOGOUT Routes

router.get('/logout',function(req,res){
    req.logout();
    req.flash("success", "Successfully Logged Out");
    res.redirect('/campgrounds');
});






function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

module.exports = router;
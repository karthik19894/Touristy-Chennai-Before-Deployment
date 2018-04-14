var express=require('express'),
router=express.router(),
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
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect('/campgrounds');
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
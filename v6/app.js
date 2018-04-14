var express=require("express"),
app=express(),
bodyParser=require('body-parser'),
mongoose=require('mongoose'),
passport=require('passport'),
LocalStrategy=require('passport-local'),
User=require('./models/user.js'),
Campground=require('./models/campground'),
Comment=require('./models/comment'),
seedDB=require('./seed');

mongoose.connect("mongodb://localhost/touristychennaiv3");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

seedDB();

//PASSPORT CONFIGURATION

app.use(require('express-session')({
    secret:"Karthik is gonna become one of the best Web Developers out there",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

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

app.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res){
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

app.post('/campgrounds/:id/comments',isLoggedIn,function(req,res){
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

//AUTH ROUTES

//Show the register form

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
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

app.get('/login',function(req,res){
    res.render('login');
});

//posting login

app.post('/login',passport.authenticate("local",{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'}),function(req,res){
    
});

//LOGOUT Routes

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/campgrounds');
});

//Logic for checking authentication

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


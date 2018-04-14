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

//Requiring All the Routes

var indexRoutes=require('./routes/index'),
campgroundRoutes=require('./routes/campgrounds'),
commentRoutes=require('./routes/comments');


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

app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);




app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


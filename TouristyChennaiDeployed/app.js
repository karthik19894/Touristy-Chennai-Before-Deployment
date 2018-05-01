require('dotenv').config();
var express=require("express"),
app=express(),
bodyParser=require('body-parser'),
mongoose=require('mongoose'),
flash=require('connect-flash'),
passport=require('passport'),
LocalStrategy=require('passport-local'),
User=require('./models/user.js'),
methodOverride=require('method-override'),
Campground=require('./models/campground'),
Comment=require('./models/comment'),
seedDB=require('./seed');

//Requiring All the Routes

var indexRoutes=require('./routes/index'),
campgroundRoutes=require('./routes/campgrounds'),
commentRoutes=require('./routes/comments');

//"mongodb://karthik:password@ds135594.mlab.com:35594/touristychennai"
// mongoose.connect("mongodb://localhost/touristychennai");
mongoose.connect(process.env.DATABASEURL);


app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(flash());

app.use(methodOverride("_method"));
// seedDB();

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
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);




app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Touristy Chennai Server has Started! :) ");
});


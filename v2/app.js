var express=require("express");
var app=express();
var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

var campgrounds=[{name: "Marina",image:"https://c1.staticflickr.com/5/4040/4240277582_5c788b0934_z.jpg" },
{name: "Semmozhi Poongah", image:"https://www.makemytrip.com/travel-guide/media/dg_image/mumbai/Joggers-Park_Mumbai.jpg"},
{name:"Mahabalipuram",image:"https://a.travel-assets.com/findyours-php/viewfinder/images/res60/68000/68500-New-Town-Eco-Park.jpg"}];

app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render("landing");
});



app.get('/campgrounds',function(req,res){
    res.render('campgrounds',{campgrounds:campgrounds});
});

app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var campground={name:name,image:image};
    campgrounds.push(campground);
    res.redirect('campgrounds')
    
});

app.get('/campgrounds/new',function(req,res)
{
    res.render('newcampground');
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


var express=require("express");
var app=express();

app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render("landing");
});

app.get('/campgrounds',function(req,res){
    var campgrounds=[{name: "Chennai",image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Semmozhi_Poonga_4.jpg/190px-Semmozhi_Poonga_4.jpg" },
    {name: "Mumbai", image:"https://www.makemytrip.com/travel-guide/media/dg_image/mumbai/Joggers-Park_Mumbai.jpg"},{name:"Kolkatta",image:"https://a.travel-assets.com/findyours-php/viewfinder/images/res60/68000/68500-New-Town-Eco-Park.jpg"}];
    res.render('campgrounds',{campgrounds:campgrounds});
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server has Started! :) ");
});


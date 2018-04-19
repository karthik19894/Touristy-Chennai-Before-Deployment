var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost/touristychennaiv3");


var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
        }
        
        ],
    author:{
        id:{type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});

module.exports=mongoose.model("Campground",campgroundSchema);

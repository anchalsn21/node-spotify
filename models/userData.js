var mongoose = require('mongoose');
// var Schema = mongoose.Schema();

const userDataSchema= mongoose.Schema({
    userName:{
        type:String,
        
    },
    userData:{
        type: Object,
        
    }
},{ timestamps: true })


module.exports=mongoose.model("SpotifyUsers",userDataSchema)
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        max:100
    },
    description:{
        type:String,
        required:true,
        max:500
    },
    likes:{
        type:Number,
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
})

module.exports = mongoose.model('posts', PostSchema);

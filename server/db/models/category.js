const mongoose=require('mongoose')

const category=new mongoose.Schema({
    category:String,
})
module.exports=mongoose.model("category",category)
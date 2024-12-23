const mongoose=require('mongoose')

const brand=new mongoose.Schema({
    brand:String,
})
module.exports=mongoose.model("brand",brand)
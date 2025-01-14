const mongoose=require ('mongoose')
const user_type=require('./user_type')

mongoose.set('strictPopulate', false);

const users=new mongoose.Schema({


        email:{
            type:String,
            // required:true,
        },
        password:{
            type:String,
            // required:true,
        },
        user_type:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"user_type"
        },
        status: { type: String, default: 'active', enum: ['active', 'blocked'] }
})
module.exports=mongoose.model("users",users);
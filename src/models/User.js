import mongoose from "mongoose";




const User = mongoose.model("User", new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    password : {
        type : String,  
        required :true
    },
    role :{
        type :String,  
        enum : ['CUSTOMER','ADMIN'],  
        default : 'CUSTOMER'
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    }
    
},{
    timestamps : true
}))


export default User
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        require: true,
        uniqe: true
    },
    password:{
        type: String
    },
    otp:
        {
            otpnum:{
                type:String
            },
            createdAt:{
                type: String
            },
            expiresAt:{
                type: String
            }
        }
    
});

const newOtp = new mongoose.model("otp",otpSchema);
export default newOtp;
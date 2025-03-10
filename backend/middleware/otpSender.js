import generateOtp from "../lib/utils/generateOtp.js"; 
import newOtp from '../models/otp.model.js';
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const otpSender = async (req,res,next) => {
    try{
        const otp = generateOtp();
        let data = req.body;
        const email = data.email
        let password = data.password
        const username = data.username
        const emailExists = await User.findOne({email})
        const userExist = await User.findOne({username})
        const salt = await bcrypt.genSalt(10);
        let savedOtp = await newOtp.findOne({email});
        
        if(email === savedOtp?.email){
           if(data.otp){
           }else{
            await newOtp.deleteOne({email})
            savedOtp = await newOtp.findOne({email})
           }
        }
        if(savedOtp){
           const isOTPcorrent = await bcrypt.compare(data.otp,savedOtp.otp?.otpnum)
           if(isOTPcorrent){
                data.password = savedOtp.password
                data.verified = true
                data.otp = ''
                req.body = data
                next()
           }else {
                data.verified = false
                data.otp = ""
                req.body = data
                next()
                //res.status(400).json({error:"Invalid OTP"})
           }
           
        }

        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            res.status(400).json({error:"Invalid email formate"});
        };
        if(emailExists){
            res.status(400).json({error:"Email already exists"});
        }
        if(userExist){
            res.status(400).json({error:"Username already exits"});
        }
        if(password === null && savedOtp){
            if(data?.verified){
            }
        }
        if (password !== null && password.length < 6 ){
            console.log("short")
                    return res.status(400).json({error: "Password must consists of 6 characters"})
                 
        }
       
        if(!emailExists && !userExist && !savedOtp){
            const hashedPassword = await bcrypt.hash(password,salt);
            const hasedOtpnum = await bcrypt.hash(otp.otpnum,salt);
            const emailOTP = otp.otpnum
            password = hashedPassword;
            otp.otpnum = hasedOtpnum;
            data.password = hashedPassword

            //node mailer
            async function main() {
                const transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  secure: true,
                  port: 465,
                  auth: {
                    user: 'brightforexhub@gmail.com',
                    pass: 'ugfnavlcjdzvljph',
                  },
                });
              
                const info = await transporter.sendMail({
                  from: 'brightforexhub@gmail.com',
                  to: email,
                  subject: 'Account Activation',
                  html: `<p> your OTP is ${emailOTP}</p>`,
                });
              }
              
              main().catch(console.error);

            //node mailer
            
            const savedOtp = new newOtp({email,password,otp})
            
           savedOtp.save()
           data.password = null
            req.body = data
            next()
        }
        
        
    }catch(error){
        console.log("Error in the optSender",error)
    }
}
export default otpSender;
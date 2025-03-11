import User from "../models/user.model.js";
import newOtp from "../models/otp.model.js"
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js"
import {v4 as uuidv4 } from 'uuid';
import {passLink} from '../models/link.model.js'
import nodemailer from 'nodemailer'

const link = uuidv4().replaceAll("-","").toString()

export const signup = async (req,res) => {
    try {
        const { fullName,username,email,password,verified } = req.body
        const data = req.body;
        
        const newUser = new User({
            fullName,
            username,
            email,
            password
        });
        if(!verified){
            data.password = null
            data.otp = ""
            data.verified = false
            res.status(200).json({data})
        } 

        if(verified){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username:newUser,username,
                email: newUser.email,
                followers: newUser.followers,
                following:newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio
        })   
        await newOtp.deleteOne({email})
        }
          
        
    } catch (error){
        console.log("Error in signup controller",error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
};
export const login = async (req,res) => {
    try{ 
        const { username, password } = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid Credentials"});
        }
        
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following:user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        });

    } catch(error){
        console.log("Error in login controller");
        res.status(500).json({error:"Internal server Error"});
    }
};

export const logout = async (req,res) => {
   try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logout successfully"})
   } catch(error){
    console.log("Error in the logout controller",error.message)
    res.send(500).json({error:"Internal server error"})
   }
};

export const getMe = async (req,res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);

    } catch(error){
        console.log("error in getMe Controller", error.message)
        return res.status(500).json({error:"Internal Server Error"})

    }
}

export const password = async(req,res) =>{
    try{
        const mailLink  = req.params.mailLink
        if(mailLink === "ui"){
            const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const {email} = req.body
            const user = await User.findOne({email})
            const linkexits = await passLink.findOne({email})
            if(linkexits){
                await passLink.deleteOne({email})
            }
            const salt = await bcrypt.genSalt(10)
            //const hashedLink = await bcrypt.hash(userlink,salt);

            if(!emailRegex.test(email)){return res.status(400).json({error:"Invalid Email format"})}
            if(!user) {return res.status(404).json({error:"User doesnot exist"})};

            if(user){
            //node mailer
            async function main() {
                             const transporter = nodemailer.createTransport({
                              host: 'smtp.gmail.com',
                              secure: true,
                               port: 465,
                              auth: {
                                user: 'brightforexhub@gmail.com',
                                pass: process.env.EMAIL_PASS,
                              },
                            });
                        
                            const info = await transporter.sendMail({
                              from: 'brightforexhub@gmail.com',
                              to: email,
                              subject: 'Account Activation',
                              html: `<div>
                              <p></p>
                              <a href="https://twitter-ct37.onrender.com/api/auth/reset/${link}">Click here to reset your password</a>
                              </div>`
                              ,
                            });
                          } 
                          main().catch(console.error);

            //node mailer

            const savedLink = new passLink({email,link})
            await savedLink.save()
            return res.status(200).json({message:"Reset Link sent to the email"})
        
            }else {
            return res.status(404).json({error:"User Not Found"})
            }    
        } else{
            const link  = req.params.mailLink
            const verifiedLink = await passLink.findOne({link})
            
            if(verifiedLink){
                const email = verifiedLink.email
                const user = await User.findOne({email});
                const newPassword = req.body.newpassword
                const salt = await bcrypt.genSalt(10);
                const hashednew = await bcrypt.hash(newPassword,salt)
                user.password = hashednew
                await user.save()
                res.send("Password Successfully updated Login with new password")
                await passLink.deleteOne({link})
                
            }else{
                res.send("Forbidden")
            }
        }
        
       
    }catch(error){
        res.status(500).json({error:"Internal server Error"})
        console.log("Error in the auth reset password controller",error)
    }
}

export const passform = async(req,res)=>{
    const link = req.params.mailLink;

    const validLink = await passLink.findOne({link});
    
    if(validLink){
        res.render("pages/password")
    }else{
        res.send("Invalid")
    }

}
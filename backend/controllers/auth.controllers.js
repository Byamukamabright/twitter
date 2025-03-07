import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js"

export const signup = async (req,res) => {
    try {
        const { fullName,username,email,password } = req.body

        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        }

        const existingUser = await User.findOne({username})
        if (existingUser){
            return res.status(400).json({error: "Username is already taken"});
        }
        const existingEmail = await User.findOne({email})
        if (existingEmail){
            return res.status(400).json({error: "Email is already taken"});
        }
        if (password.length < 6){
            return res.status(400).json({error: "Password must consists of 6 characters"})
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
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
        } else {
            res.status(400).json({err:"Invalid user data"})
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
        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { username,email,newpassword } = req.body
        const user = await User.findOne({username})

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(newpassword,salt) 

        if(!emailRegex.test(email)){return res.status(400).json("Invalid Email format")}
        if(!user) {return res.status(404).json("User doesnot exist")};

        if(username === user.username && email === user.email){
            user.password = await bcrypt.hash(newpassword,salt)
            res.status(200).json("password updated successful")
            await user.save()
        }
    }catch(error){
        res.status(500).json("Internal server Error")
        console.log("Error in the auth reset password controller")
    }
}
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js"

export const createPost = async (req,res) => {
    try{
        const {text} = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not Found"});
        if(!text && !img)return res.status(400).json({message:"Post must have text or image"});
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }
        const newPost = new Post({
            user:userId,
            text,
            img,
        });
        await newPost.save()
        res.status(201).json(newPost)

    } catch(error){
        console.log("error in the createPost Controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
};

export const deletePost = async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json({error:"Post not Found"})
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"You arenot authorized to delete this post"})
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"post deleted successfully"})
    }catch(error){
        console.log("error in the delete Post controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const commetOnPost = async (req,res) => {
    try{
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if(!text)return res.status(400).json({message:"Text feild is required"})
        const post = await Post.findById(postId);
        if(!post)return res.status(404).json({error:"Post not found"})
        const comment = {user: userId,text};
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    } catch(error){
        console.log("error in the commentOnPost controller",error.message)
        res.status(500).json({error:"Internal server Error"})
    }
}

export const likeUnlikePost = async (req,res) => {
    try{
        const userId = req.user._id;
        const { id:postId } = req.params;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({error:"Post Not Found"});
        const userLikedPost = post.likes.includes(userId);


        if(userLikedPost){
            await Post.updateOne({_id:postId},{$pull: {likes: userId}});
            await User.updateOne({_id:userId}, {$pull: {likedPosts: postId}});
            const updatedLikes = post.likes.filter((id)=> id.toString() !== userId.toString() )
            res.status(200).json(updatedLikes);
            
        } else {
            post.likes.push(userId)
            await User.updateOne({_id:userId},{$push: {likedPosts: postId}});
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            });
             await notification.save()
             const updatedLikes = post.likes
             res.status(200).json(updatedLikes)

        }
    } catch(error){
        console.log("Error in the likeUnlikePost controller")
        res.status(500).json({error: "Internal server error"})
    }
}

export const getAllPosts = async (req,res) => {
    try{
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });
        if(posts.length ===0 ) {
            return res.status(200).json([])
        }
        res.status(200).json(posts)
    } catch(error){
        console.log("Error in the getAllPosts controller");
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getLikedPosts = async (req,res) =>{
    const userId = req.params.id
    console.log(userId)
    try{
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({error:"User not found"});
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path: "comments.user",
            select:"-password"
        })
        res.status(200).json(likedPosts);

    } catch(error){
        console.log("error in the getLikedPosts controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getFollowingPosts = async (req,res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"user not found"});
        const following = user.following
        const feedPosts = await Post.find({user:{$in: following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        });

        res.status(200).json(feedPosts)
    } catch(error){
        console.log("error in getFollowingPost",error.message)
        res.status(500).json({error:"Internal seerver error"})
    }
}

export const getUserPosts = async (req,res) => {
    try{
        const { username } = req.params;
        const user = await User.findOne({username});
        if(!user)return res.status(404).json({error:"user not found"});
        const posts = await Post.find({user: user._id}).sort({createdAt: -1 }).
        populate({
            path:"user",
            select:"-password"
        });
        res.status(200).json(posts)

    } catch(error){
        console.log("error in the getUserPosts Controller");
        res.status(500).json({error:"internal server error"})
    }
}
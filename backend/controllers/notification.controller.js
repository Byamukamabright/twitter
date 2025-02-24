import Notification from "../models/notification.model.js"

export const getNotifications = async (req,res) => {
    try{
        const userId = req.user._id;
        const notifications = await Notification.find({to:userId}).populate({path:"from",select:"username profileImg"});

        await Notification.updateMany({to:userId},{read:true});
        res.status(200).json(notifications);
    } catch(error){
        console.log("error in the getNotifications controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
    
}
export const deleteNotifications = async (req,res) => {
    try{
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"Successfully deleted notification"});
    } catch(error){
        console.log("error in the deleteNotifications controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const deleteNotification = async (req,res) => {
    try{
        const userId = req.user._id;
        const notificationId = req.params.id;
        const notification = await Notification.findById({notificationId})
        if(!notification) res.status(404).json({error:"Notification Not found"})
        if(userId.toString() !== notification.to.toString()){
            return res.status(403).json({error:"You arenot allowed to delete this post"})
        }
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message:"Notification deleted Succeffully"})
    }catch(error){
        console.log("error in the deleteNotification controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
};
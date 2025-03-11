import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    link:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        unique: true
    }
});

export const passLink = new mongoose.model("link",linkSchema)
export default passLink;
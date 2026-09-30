import mongoose from "mongoose";
import User from "./User.js";

const messageSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    role: {
        type : String,
        enum : ["user","assistant"],
        required : true
    },
},{timestamps : true},
)


const ThreadSchema = new mongoose.Schema({
    threadId : {
        type: String,
        required: true,
        unique: true
    },
    title : {
        type : String,
        default :"New Chat"
    },
    messages : [messageSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    createdAt : {
        type : Date,
        default: Date.now
    },
    updatedAt : {
        type : Date,
        default: Date.now
    }
})

const Thread = mongoose.model("Thread",ThreadSchema);
export default Thread;
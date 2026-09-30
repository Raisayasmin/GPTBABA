import express from "express";
import Thread from "../models/Thread.js";
const router = express.Router();
import {
    getOpenAIAPIResponse,
    getOpenAITitleResponse
} from "../utils/openai.js";
import authenticateToken from "./auth.js";


// router.post("/test",async(req,res) =>{
//    try {
//     const thread = new Thread({
//         threadId : "xyz",
//         title : "Testing my new Thread"
//     });
//     const response = await thread.save();
//     res.send(response);
//    } catch(err) {
//     console.log(err);
//     res.status(500).json({error: "Failed to save in db"});
//    }
// })

router.get("/thread",authenticateToken, async (req, res) => {
  try {
    const threads = await Thread.find({user : req.user.id}).sort({ updatedAt: -1 });
    res.send(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in db" });
  }
});

router.get("/thread/:threadId",authenticateToken, async (req, res) => {
  const {threadId} = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if(!thread){
        return res.status(404).json({error:"Thread not found"});
    }
    if(thread.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this thread" });
    }
    res.send(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId",authenticateToken,async(req,res) => {
    const {threadId} = req.params;
    try {
        const thread = await Thread.findOne({threadId});
        if(!thread){
         return res.status(404).json({error:"Thread could not be deleted"});
        }
        if(thread.user.toString() !== req.user.id) {
          return res.status(403).json({error : "Not authorize to delete this thread"});
        }
        await Thread.findOneAndDelete({threadId});
        res.json({message : "Thread deleted"});
        
    } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
})


router.post("/chat",authenticateToken,async(req,res) => {
    const {threadId,message} = req.body;
    const aiTitle = await getOpenAITitleResponse(message);
    if(!threadId || !message){
        return res.status(400).json({error:"missing required fields"});
    }
    try {
        let thread = await Thread.findOne({threadId});
        if(!thread) {
             
            thread = new Thread ({
                threadId,
                title: aiTitle,
                user:req.user.id,
                messages: [{role: "user",content: message}]
            });
        } else {
            thread.messages.push({role:"user",content:message});
        }
        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant",content: assistantReply})
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply:assistantReply});
    } catch (err) {
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
})

export default router;

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/userAuth.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
})
app.use("/api",chatRoutes);
app.use("/api",userRoutes);

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected with database");
    } catch(err) {
        console.log("Failed with err ",err);
    }
}
// app.post("/test", async(req,res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type" : "application/json",
//             "Authorization" : `Bearer ${process.env.GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "openai/gpt-oss-20b",
//             messages: [{
//                 role : "user",
//                 content : req.body.message
//             }]
//         })
//     };
//     try {
//         const response = await fetch('https://api.groq.com/openai/v1/chat/completions', options);
//         const data = await response.json();
//         // console.log(data.choices[0].message.content);
//         res.send(data);
//     } catch(err){
//         console.log(err);
//     }
// })




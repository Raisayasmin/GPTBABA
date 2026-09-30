import express from "express";
import User from "../models/User.js";
const router = express.Router();
import bcrypt from 'bcrypt';
import "dotenv/config";
import jwt from 'jsonwebtoken';
import authenticateToken from "./auth.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


// router.post("/test",async(req,res) => {
//     try {
//       const newUser = new User({
//         name : "Raisa",
//         email : "raisa@gmail",
//         password : "abc@hashed",
//       })
//       const response = await newUser.save();
//       res.send(response);
//     } catch(err){
//         console.log(err);
//     }
// })

router.post("/signup", async(req,res) => {
  const {name, email,password} = req.body;
  const newPassword = await bcrypt.hash(password,10);

  try {
    const existUser = await User.findOne({email});
    if(existUser){
      return res.status(409).json({message : "An Account with this email already exist"});
    }
    const newUser = new User({
      name : name,
      email : email,
      password : newPassword
    })
    await newUser.save();
    res.send(newUser);
  } catch(err){
    console.log(err);
  }
})

router.post("/login", async(req,res) => {
  const {email,password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
      return res.status(401).json({message: "Invalid password"});
    }

    const userPayload = { id: user._id };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful!", token: token });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post("/refresh",async(req,res) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({message : "No refresh token provided"});
  }

  try {
    const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if(!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({message : "Invalid refresh token"});
    }

    const newAccessToken = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '1h'});
    res.json({token : newAccessToken});

  } catch (err) {
    console.log(err);
    return res.status(403).json({message : "Invalid or expired refresh token"});
  }
})

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (err) {
      // token might already be invalid/expired — that's fine, just continue
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
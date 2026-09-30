import React, { useContext,useEffect } from "react";
import "./ChatWindow.css";
import { MyContext } from "./MyContext";
import { useState, CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import authFetch from "./authFetch.js";
const API_URL = import.meta.env.VITE_API_URL


function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId,prevChats,setPrevChats} =
    useContext(MyContext);
    const [isOpen,setIsopen] = useState(false);
    const [loading,setLoading] = useState(false);
  
   
    const navigate = useNavigate();

  const getReply = async () => {
    const token = localStorage.getItem("token"); 
    if(!token){
      navigate("/signup");
      return;
    }
    setLoading(true);
    
    console.log(prompt, currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      // const response = await authFetch("http://localhost:8080/api/chat", options);
      const response = await authFetch('${API_URL}/api/chat', options);
      const res = await response.json();

      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
   if(prompt && reply){
    setPrevChats(prevChats => (
      [...prevChats,{
        role:"user",
        content: prompt
      },{
        role:"assistant",
        content:reply
      }]
    ))
   }
   setPrompt("");
  },[reply])

  const handleProfileClick = () => {
    setIsopen(!isOpen);
  }

const handleLogout = async () => {
  try {
    // await authFetch("http://localhost:8080/api/logout", {
    await authFetch(`${API_URL}/api/logout`, {
      method: "POST",
    });
    
  } catch (err) {
    console.log(err);
  }
  localStorage.removeItem("token");

  navigate("/login");

};

const isLoggedIn = !!localStorage.getItem("token");
  
  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          GPTBABA <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="usericondiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {
        isOpen && 
        <div className="dropDown">
          <div className="dropDownItem"> <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
          <div className="dropDownItem"> <i className="fa-solid fa-gear"></i>settings</div>
          <div className="dropDownItem" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket" ></i> <span>{isLoggedIn ? "Log out" : "Log in"}</span></div>
          <div></div>
          <div></div>
        </div>
      }
      <Chat></Chat>
      <ClipLoader
        color="#aff"
        loading={loading}
      />
      <div className="chatInput">
        <p className="info">
          cloneGPT can make mistakes. Check important info.
        </p>
        <div className="InputBox">
          <input
            className="input"
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? getReply() : ""}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-arrow-up"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;

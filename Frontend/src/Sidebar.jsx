import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import authFetch from "./authFetch.js";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats
  } = useContext(MyContext);
  const [threadTitle, setThreadTitle] = useState([]);

  const getAllThreads = async () => {
    try {
      const token = localStorage.getItem("token");
      if(!token) return;
    
      const response = await authFetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filterData);
      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
    
      const response = await authFetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/thread/${newThreadId}`,
        {
          method: "DELETE",
        },
      );
      const res = await response.json();
       if (!response.ok) {
      console.log("Delete failed:", res.error);
      return;
    }
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== newThreadId),
      );
      if (newThreadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="Sidebar">
      <h2 className="head">GPTBABA</h2>
      <button className="newChat-btn" onClick={createNewChat}>
        <i className="fa-solid fa-pen-to-square icon"></i>
        <span className="newChat">New Chat</span>
      </button>
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title}{" "}
            <i
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
              className="fa-solid fa-trash deleteIcon"
            ></i>
          </li>
        ))}
      </ul>
      <div className="sign">
        <p>By RaisaYasmin &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;

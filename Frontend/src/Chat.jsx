import "./Chat.css";
import {MyContext} from "./MyContext";
import {useContext, useEffect,useState} from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat (){
    const {newChat,prevChats,reply,setNewChat} = useContext(MyContext);
    const [latestReply,setLatestReply] = useState(null);

    

    useEffect(() => {
        if(!prevChats?.length ) return; //"if prevChats is missing, OR its length is 0 then return"

        if(reply === null){
            setLatestReply(null);
            return;
        }
        setNewChat(false);
        const content = reply.split(" ");
 
        let idx = 0;
        const interval = setInterval(() => {
           setLatestReply(content.slice(0,idx+1).join(" "));
           idx++;
           if(idx >= content.length) clearInterval(interval);
        },40);

        return () => clearInterval(interval);
    },[prevChats,reply]);

    return (
        <>
        {newChat && <h1>Start a new Chat!</h1>}
    
        <div className="chats">
        {
            prevChats.slice(0,-1).map((Chat,idx)=> 
             <div className={Chat.role == "user"?"userDiv":"gptDiv"} key={idx}>
             {
                Chat.role === "user"?
                <p className="userMessage">{Chat.content}</p>: 
                <ReactMarkdown rehypePlugins={rehypeHighlight}>{Chat.content}</ReactMarkdown>
             }
             </div>
            )

        }
        {
            prevChats?.length > 0 && latestReply !== null && 
            <div className="gptDiv" key={"typing"}>
               <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
            </div>
        }
        {
            prevChats.length > 0 && latestReply === null && 
            <div className="gptDiv" key={"non-typing"}>
               <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
            </div>
        }
        </div>
        </>
    )
}

export default Chat;

{/* <div className="userDiv">
            <p className="userMessage">User Message</p>
        </div>
        <div className="gptDiv">
            <p className="gptMessage">GPT Generated Message</p>
        </div> */}
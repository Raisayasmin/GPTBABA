import 'dotenv/config';

const getOpenAIAPIResponse = async(message) => {
     const options = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [{
                role : "user",
                content : message
            }]
        })
    };
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', options);
        const data = await response.json();
        // console.log(data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch(err){
        console.log(err);
    }
}


const getOpenAITitleResponse = async(message) => {
    const options = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${process.env.GROQ_API_KEY}`
        },
        body : JSON.stringify({
            model : "openai/gpt-oss-20b",
            messages : [
                {
                    role: "system",
                    content: "You generate short chat titles. Reply with ONLY the title text — no quotes, no punctuation at the end, no explanation, no prefix like 'Title:'. Maximum 4 words."
                },
                {
                role: "user",
                content: message
            }]
        })
    };
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions',options);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch(err){
        console.log(err);
    }
}

export {getOpenAIAPIResponse,getOpenAITitleResponse} ;
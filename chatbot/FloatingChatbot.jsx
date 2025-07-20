import React, { useState } from "react";
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = "AIzaSyCEEEaRKi3_Iv1jYhlhdT0yQzTyAvNIOHk"; 

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
    const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCEEEaRKi3_Iv1jYhlhdT0yQzTyAvNIOHk",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: input }],
        },
      ],
    }),
  }
);
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
      const botMessage = { role: "bot", text: reply };
      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      setChat((prev) => [...prev, { role: "bot", text: "❌ Error fetching reply." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>💬</div>

      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-messages">
            {chat.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>{msg.text}</div>
            ))}
            {isLoading && <div className="message bot">Typing...</div>}
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Type here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;

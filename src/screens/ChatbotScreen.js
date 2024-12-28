import React, { useState } from "react";
import axios from "axios";
import "../styles/ChatbotScreen.css"; // Ensure this file exists for styling

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  console.log("API_URL:", API_URL);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, { prompt: input });
      const aiResponse = response.data?.response?.trim();
      if (!aiResponse) throw new Error("Invalid AI response");

      setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error("Error details:", error.response || error);
      const errorMessage =
        error.response?.data?.error ||
        "Oops! Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="chatbot-screen">
      <header className="chat-header">
        <h1>Chatbot</h1>
      </header>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-message bot">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotScreen;

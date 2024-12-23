import React, { useState } from "react";
import axios from "axios";
import "../styles/ChatbotScreen.css"; // Ensure this file exists for styling

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState(""); // Input field value
  const [loading, setLoading] = useState(false); // Loading state for AI response

  const handleSend = async () => {
    if (!input.trim()) return; // Ignore empty input
  
    // Add the user message to the chat history
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput(""); // Clear input field
    setLoading(true); // Show loading indicator
  
    try {
      // Call the backend API
      const response = await axios.post(
        "https://us-central1-remedicate-app.cloudfunctions.net/api/chat",
        { prompt: input }
      );
  
      // Extract AI response and add it to chat history
      const aiResponse = response.data.response.trim();
      setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Oops! Something went wrong. Please try again.";
      console.error("Error calling backend API:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    } finally {
      setLoading(false); // Hide loading indicator
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

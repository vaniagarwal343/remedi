import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUserProfile } from "../context/UserProfileContext";
import { Send, Loader } from "lucide-react";
import "../styles/ChatbotScreen.css";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const ChatbotScreen = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { profileData, loading: profileLoading } = useUserProfile();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add a welcome message with profile data on initialization
  useEffect(() => {
    if (!profileLoading && profileData) {
      const welcomeMessage = `Hello ${profileData.name || "there"}! Welcome to your health assistant. How can I assist you today?`;
      setMessages([{ sender: "bot", text: welcomeMessage }]);
    }
  }, [profileLoading, profileData]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://us-central1-remedicate-app.cloudfunctions.net/api/chat",
        {
          prompt: input,
          userProfile: profileData, // Pass profile data to the backend
        }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data?.response?.trim() || "Error: No response." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user";
    return (
      <div className={`message ${isUser ? "user" : "bot"}`}>
        <p>{message.text}</p>
      </div>
    );
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="bg-[#0D315C] text-white px-4 py-6">
          <h1 className="text-2xl font-semibold text-center">Health Assistant</h1>
        </div>
        <div className="flex-1 flex items-center justify-center flex-col gap-3">
          <Loader className="w-8 h-8 animate-spin text-[#0D315C]" />
          <span className="text-gray-600 font-medium">Loading profile data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-screen">
      {/* Logo Section */}
      {messages.length === 0 && (
        <div className="centered-logo">
          <img src={Logo} alt="REMEDII Logo" className="logo" />
          <h2>Welcome to Your Health Assistant</h2>
          <p>Ask about medications, symptoms, or health questions!</p>
        </div>
      )}

      {/* Chat History */}
      <div className="chat-history">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {loading && (
          <div className="message bot">
            <Loader className="spinner" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask about your health or medications..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend} disabled={!input.trim() || loading}>
          <Send className="icon" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/calendar")}>Tracker</button>
        <button onClick={() => navigate("/chatbot")}>Quick Q/A</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
      </nav>
    </div>
  );
};

export default ChatbotScreen;

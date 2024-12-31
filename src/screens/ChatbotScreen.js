import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUserProfile } from "../context/UserProfileContext";
import { Send, Loader, AlertCircle } from "lucide-react";
import "../styles/ChatbotScreen.css";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const ChatbotScreen = () => {
  const navigate = useNavigate(); // Initialize navigate
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

  const getConversationHistory = () => {
    return messages.slice(-5).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newUserMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://us-central1-remedicate-app.cloudfunctions.net/api/chat",
        {
          prompt: input,
          userProfile: profileData,
          conversationHistory: getConversationHistory(),
        }
      );

      const aiResponse = response.data?.response?.trim();
      if (!aiResponse) throw new Error("Invalid AI response");

      setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Oops! Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user";
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-[80%] p-3 rounded-2xl ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
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
    <div className="flex flex-col h-screen bg-white">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={Logo} alt="REMEDII Logo" className="header-logo" />
      </div>

      {/* Header */}
      <div className="bg-[#0D315C] text-white px-4 py-6">
        <h1 className="text-2xl font-semibold text-center">Health Assistant</h1>
        {profileData && (
          <p className="text-sm text-gray-300 text-center mt-1">
            Profile loaded for: {profileData.name || "User"}
          </p>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <AlertCircle className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Your Health Assistant
            </h3>
            <p className="text-gray-500 max-w-md">
              Ask me anything about your medications, symptoms, or general health
              questions.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
              <Loader className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about your health or medications..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || !profileData}
            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || !profileData}
            className={`p-3 rounded-full transition-colors ${
              !input.trim() || loading || !profileData
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
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

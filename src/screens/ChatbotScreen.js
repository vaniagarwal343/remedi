import React, { useState } from "react";
import axios from "axios";
import { useUserProfile } from '../context/UserProfileContext';
import "../styles/ChatbotScreen.css";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { profileData, loading: profileLoading } = useUserProfile();

  // Debug logging
  console.log('ChatbotScreen current profile:', profileData);
  console.log('ChatbotScreen profile loading:', profileLoading);

  const getConversationHistory = () => {
    return messages.slice(-5).map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newUserMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log('Sending request with profile:', profileData);
      const response = await axios.post(
        'https://us-central1-remedicate-app.cloudfunctions.net/api/chat',
        {
          prompt: input,
          userProfile: profileData,
          conversationHistory: getConversationHistory()
        }
      );

      console.log('API Response:', response.data);

      const aiResponse = response.data?.response?.trim();
      if (!aiResponse) throw new Error("Invalid AI response");

      setMessages(prev => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.error || 
        "Oops! Something went wrong. Please try again.";
      setMessages(prev => [...prev, { sender: "bot", text: errorMessage }]);
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

  if (profileLoading) {
    return (
      <div className="chatbot-screen">
        <header className="chat-header">
          <h1>Health Assistant</h1>
        </header>
        <div className="loading">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="chatbot-screen">
      <header className="chat-header">
        <h1>Health Assistant</h1>
        {profileData && (
          <div className="profile-status">
            Profile loaded for: {profileData.name || 'User'}
          </div>
        )}
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
          placeholder={profileData 
            ? "Ask about your health or medications..." 
            : "Please complete your profile first"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading || !profileData}
        />
        <button 
          onClick={handleSend} 
          disabled={loading || !profileData}
        >
          Send
        </button>
      </div>

      {!profileData && (
        <div className="no-profile-warning">
          Please complete your profile in the Profile section before using the chat.
        </div>
      )}
    </div>
  );
};

export default ChatbotScreen;
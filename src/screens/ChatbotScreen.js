import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "../styles/ChatbotScreen.css";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("No authenticated user");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        console.log("User doc data:", userDoc.data());

        const medsQuery = query(
          collection(db, "medications"), 
          where("userId", "==", user.uid)
        );
        const medsSnapshot = await getDocs(medsQuery);
        const medications = medsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Medications:", medications);

        const profileData = {
          ...userDoc.data(),
          medications
        };
        console.log("Setting user profile:", profileData);
        setUserProfile(profileData);

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const getConversationHistory = () => {
    return messages.slice(-5).map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending request with profile:", userProfile);
      const response = await axios.post(
        'https://us-central1-remedicate-app.cloudfunctions.net/api/chat',
        {
          prompt: input,
          userProfile,
          conversationHistory: getConversationHistory()
        }
      );

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

  return (
    <div className="chatbot-screen">
      <header className="chat-header">
        <h1>Health Assistant</h1>
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
          placeholder="Ask about your health or medications..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotScreen;
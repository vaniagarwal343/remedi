import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import AddMedication from "./screens/AddMedication"; // Import AddMedication screen
import CalendarScreen from "./screens/CalendarScreen";
import ProfileScreen from "./screens/ProfileScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/chatbot" element={<ChatbotScreen />} />
        <Route path="/add-medication" element={<AddMedication />} /> {/* Add Medication Route */}
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
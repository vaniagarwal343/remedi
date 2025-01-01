import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import AddMedication from "./screens/AddMedication";
import CalendarScreen from "./screens/CalendarScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { UserProfileProvider } from './context/UserProfileContext';

const App = () => {
  return (
    <UserProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/chatbot" element={<ChatbotScreen />} />
          <Route path="/add-medication" element={<AddMedication />} />
          <Route path="/calendar" element={<CalendarScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/edit-profile" element={<EditProfileScreen />} />
        </Routes>
      </BrowserRouter>
    </UserProfileProvider>
  );
};

export default App;
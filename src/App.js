import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import AddMedication from "./screens/AddMedication";
import CalendarScreen from "./screens/CalendarScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen"
import EditMedicationScreen from "./screens/EditMedicationScreen"
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
          <Route path="/edit-medication" element={<EditMedicationScreen />} />
        </Routes>
      </BrowserRouter>
    </UserProfileProvider>
  );
};

export default App;
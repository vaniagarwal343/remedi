import React from "react";
import { useUserProfile } from "../context/UserProfileContext";
import "../styles/ProfileScreen.css";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const { profileData } = useUserProfile();
  const navigate = useNavigate();

  const handleEditMedication = (medication) => {
    navigate('/edit-medication', { state: { medication } });
  };

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      {/* Personal Info */}
      <section className="profile-section">
        <h2>Personal Info</h2>
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{profileData?.name || "N/A"}</span>
        </div>
      </section>

      {/* Medical History */}
      <section className="profile-section">
        <h2>Medical History</h2>
        <div className="info-row">
          <span className="info-label">Allergies:</span>
          <span className="info-value">{profileData?.allergies || "None"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Conditions:</span>
          <span className="info-value">{profileData?.conditions || "None"}</span>
        </div>
      </section>

      {/* Current Medications */}
      <section className="profile-section">
        <h2>Current Medications</h2>
        {profileData?.medications?.length > 0 ? (
          <ul className="medication-list">
            {profileData.medications.map((med) => (
              <li
                key={med.id}
                className="medication-item"
                onClick={() => handleEditMedication(med)}
              >
                <span className="medication-name">{med.name}</span>
                <span className="medication-info">
                  {med.dosage} - {med.frequency}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications added yet.</p>
        )}
      </section>

      {/* Edit Button */}
      <div className="edit-button-container">
        <button className="edit-button" onClick={() => navigate("/edit-profile")}>
          Edit Profile
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

export default ProfileScreen;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "../styles/ProfileScreen.css";
import { auth, db } from "../firebaseConfig";
import { useUserProfile } from '../context/UserProfileContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { profileData, loading, refreshProfile } = useUserProfile();
  const [name, setName] = useState(profileData?.name || "");
  const [allergies, setAllergies] = useState(profileData?.allergies || "");
  const [conditions, setConditions] = useState(profileData?.conditions || "");

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name,
        allergies,
        conditions,
      });

      await refreshProfile(); // Refresh profile data after saving
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-screen">
      <header>
        <h1>Profile</h1>
      </header>

      <section className="profile-section">
        <h2>Personal Info</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </section>

      <section className="medical-history-section">
        <h2>Medical History</h2>
        <label>
          Allergies:
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          />
        </label>
        <label>
          Conditions:
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
        </label>
      </section>

      <section className="medication-list-section">
        <h2>Current Medications</h2>
        {profileData?.medications?.length > 0 ? (
          <ul>
            {profileData.medications.map((med) => (
              <li key={med.id}>
                <strong>{med.medicationName}</strong> - {med.dosage} ({med.frequency})
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications added yet.</p>
        )}
      </section>

      <button className="save-button" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
};

export default ProfileScreen;
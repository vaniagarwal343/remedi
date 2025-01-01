import React, { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import "../styles/EditProfileScreen.css";
import { useNavigate } from "react-router-dom";

const EditProfileScreen = () => {
  const { profileData, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: profileData?.name || "",
    allergies: profileData?.allergies || "",
    conditions: profileData?.conditions || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData); // Save the updated profile data
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="edit-profile-screen">
      <h1>Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSave}>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        {/* Allergies */}
        <div className="form-group">
          <label htmlFor="allergies">Allergies</label>
          <textarea
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Enter your allergies"
          />
        </div>

        {/* Conditions */}
        <div className="form-group">
          <label htmlFor="conditions">Conditions</label>
          <textarea
            id="conditions"
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            placeholder="Enter your conditions"
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileScreen;

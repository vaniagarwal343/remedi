import React, { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import "../styles/ProfileScreen.css";
import { Modal } from "react-modal";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const { profileData } = useUserProfile();
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedication(null);
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
                <span className="medication-dosage">{med.dosage}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications added yet.</p>
        )}
      </section>

      {/* Modal for Editing Medication */}
      {isModalOpen && selectedMedication && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="edit-modal"
          overlayClassName="modal-overlay"
        >
          <h2>Edit Medication</h2>
          <form>
            <div className="form-group">
              <label>Medication Name</label>
              <input
                type="text"
                value={selectedMedication.name}
                onChange={(e) =>
                  setSelectedMedication({
                    ...selectedMedication,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <input
                type="text"
                value={selectedMedication.dosage}
                onChange={(e) =>
                  setSelectedMedication({
                    ...selectedMedication,
                    dosage: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Frequency</label>
              <input
                type="text"
                value={selectedMedication.frequency}
                onChange={(e) =>
                  setSelectedMedication({
                    ...selectedMedication,
                    frequency: e.target.value,
                  })
                }
              />
            </div>
            <button type="button" onClick={closeModal} className="cancel-button">
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                // Logic to save medication changes
                closeModal();
              }}
              className="save-button"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Button */}
      <div className="edit-button-container">
        <button className="edit-button" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;

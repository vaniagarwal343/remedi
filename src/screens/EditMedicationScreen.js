import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/EditMedicationScreen.css";

const EditMedicationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const medication = location.state?.medication;

  const [formData, setFormData] = useState({
    name: medication?.name || "",
    dosage: medication?.dosage || "",
    frequency: medication?.frequency || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const medRef = doc(db, "medications", medication.id);
      await updateDoc(medRef, formData);
      alert("Medication updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating medication:", error);
      alert("Failed to update medication.");
    }
  };

  if (!medication) {
    return <div>No medication data found</div>;
  }

  return (
    <div className="edit-medication-screen">
      <h1>Edit Medication</h1>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Medication Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Frequency</label>
          <input
            type="text"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="button" className="cancel-button" onClick={() => navigate("/profile")}>
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

export default EditMedicationScreen;
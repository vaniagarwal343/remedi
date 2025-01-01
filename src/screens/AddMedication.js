import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import "../styles/AddMedication.css";
import { auth, db } from "../firebaseConfig";
import Logo from "../assets/logo.png";

const validateForm = (data) => {
  const errors = [];
  
  if (!data.medicationName.trim()) {
    errors.push("Medication name is required");
  }
  
  if (!data.dosage.trim()) {
    errors.push("Dosage is required");
  }
  
  if (!data.startDate) {
    errors.push("Start date is required");
  }
  
  if (data.totalSupply <= 0) {
    errors.push("Total supply must be greater than 0");
  }
  
  if (data.dosePerDay <= 0) {
    errors.push("Dose per day must be greater than 0");
  }
  
  return errors;
};

const AddMedication = () => {
  const navigate = useNavigate();
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [dosePerDay, setDosePerDay] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm({
      medicationName,
      dosage,
      startDate,
      totalSupply,
      dosePerDay
    });

    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to be logged in to add medication.");
        navigate("/");
        return;
      }

      const calculatedEndDate = !endDate
        ? new Date(
            new Date(startDate).getTime() +
              (totalSupply / dosePerDay) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0]
        : endDate;

      // Create the medication document
      await addDoc(collection(db, "medications"), {
        name: medicationName,
        dosage: dosage,
        frequency: frequency,
        startDate,
        endDate: calculatedEndDate,
        instructions,
        totalSupply: Number(totalSupply),
        dosePerDay: Number(dosePerDay),
        userId: user.uid,
        createdAt: new Date()
      });

      alert("Medication added successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error adding medication:", error);
      alert("Failed to add medication. Please try again.");
    }
  };

  return (
    <div className="add-medication-screen">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={Logo} alt="REMEDII Logo" className="header-logo" />
      </div>

      {/* Header */}
      <header className="header">
        <h1>add medication</h1>
      </header>

      {/* Form */}
      <form className="medication-form" onSubmit={handleSubmit}>
        <label>
          medication name
          <input
            type="text"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
          />
        </label>

        <label>
          dosage (e.g., mg, ml)
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </label>

        <label>
          frequency
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Every other day">Every other day</option>
            <option value="Weekly">Weekly</option>
          </select>
        </label>

        <label>
          start date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          end date (optional)
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate} // Prevent end date before start date
          />
        </label>

        <label>
          special instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter any special instructions"
          />
        </label>

        <label>
          total supply (e.g., 30 tablets)
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            min="1"
            required
          />
        </label>

        <label>
          dose per day (e.g., 2 tablets/day)
          <input
            type="number"
            value={dosePerDay}
            onChange={(e) => setDosePerDay(e.target.value)}
            min="0.1"
            step="0.1"
            required
          />
        </label>

        <button type="submit" className="add-button">
          add medication
        </button>
      </form>

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

export default AddMedication;
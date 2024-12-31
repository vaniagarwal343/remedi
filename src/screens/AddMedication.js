import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import "../styles/AddMedication.css";
import { auth, db } from "../firebaseConfig";
import Logo from "../assets/logo.png";
import BottomNavigation from "../components/BottomNavigation";

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

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("you need to be logged in to add medication.");
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

      await addDoc(collection(db, "medications"), {
        medicationName,
        dosage,
        frequency,
        startDate,
        endDate: calculatedEndDate,
        instructions,
        totalSupply,
        dosePerDay,
        userId: user.uid,
        createdAt: new Date(),
      });

      alert("Medication added successfully!");
      navigate("/home");
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
          />
        </label>

        <label>
          special instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>

        <label>
          total supply (e.g., 30 tablets)
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            required
          />
        </label>

        <label>
          dose per day (e.g., 2 tablets/day)
          <input
            type="number"
            value={dosePerDay}
            onChange={(e) => setDosePerDay(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="add-button">
          add medication
        </button>
      </form>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AddMedication;

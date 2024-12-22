import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import "../styles/AddMedication.css"; // Styling for the screen
import { auth, db } from "../firebaseConfig";


const AddMedication = () => {
  const navigate = useNavigate();

  // Form state
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
    const user = auth.currentUser; // Get current user
    if (!user) {
      alert("You need to be logged in to add medication.");
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    const calculatedEndDate = !endDate
      ? new Date(
          new Date(startDate).getTime() + (totalSupply / dosePerDay) * 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0]
      : endDate;

    // Save to Firestore
    await addDoc(collection(db, "medications"), {
      medicationName,
      dosage,
      frequency,
      startDate,
      endDate: calculatedEndDate,
      instructions,
      totalSupply,
      dosePerDay,
      userId: user.uid, // Save with the user's ID
      createdAt: new Date(),
    });

    alert("Medication added successfully!");
    navigate("/home"); // Redirect to the homepage
  } catch (error) {
    console.error("Error adding medication:", error);
    alert("Failed to add medication. Please try again.");
  }
};


  return (
    <div className="add-medication-screen">
      <header className="header">
        <h1>Add Medication</h1>
      </header>

      <form className="medication-form" onSubmit={handleSubmit}>
        <label>
          Medication Name
          <input
            type="text"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
          />
        </label>

        <label>
          Dosage (e.g., mg, ml)
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </label>

        <label>
          Frequency
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Every other day">Every other day</option>
            <option value="Weekly">Weekly</option>
          </select>
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          End Date (optional)
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <label>
          Special Instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>

        <label>
          Total Supply (e.g., 30 tablets)
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            required
          />
        </label>

        <label>
          Dose Per Day (e.g., 2 tablets/day)
          <input
            type="number"
            value={dosePerDay}
            onChange={(e) => setDosePerDay(e.target.value)}
            required
          />
        </label>

        <button type="submit">Add Medication</button>
      </form>
    </div>
  );
};

export default AddMedication;
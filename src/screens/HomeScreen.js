import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/HomeScreen.css"; // For styling

const HomeScreen = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]); // State to store medications

  // Fetch medications for the logged-in user
  useEffect(() => {
    const user = auth.currentUser; // Get the logged-in user
    if (!user) {
      alert("You need to be logged in.");
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    const medicationsRef = collection(db, "medications");
    const q = query(medicationsRef, where("userId", "==", user.uid)); // Query user-specific medications

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedications(meds); // Update state with medication data
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [navigate]);

  return (
    <div className="home-screen">
      {/* Header */}
      <header className="home-header">
        <h1>How are you feeling today?</h1>
      </header>

      {/* Daily Insights and Reminders */}
      <section className="daily-section">
        <h2>Daily Insights & Reminders</h2>
        <ul>
          {medications.length > 0 ? (
            medications.map((med) => (
              <li key={med.id}>
                • {med.medicationName} - Take {med.dosage} {med.frequency}.
              </li>
            ))
          ) : (
            <p>No medications added yet. Click "Add Medication" below!</p>
          )}
        </ul>
      </section>

      {/* Quick Questions */}
      <section className="quick-questions">
        <h2>Quick Questions</h2>
        <input
          type="text"
          placeholder="Ask me a question!"
          onClick={() => navigate("/chatbot")} // Redirect to Chatbot page
        />
      </section>

      {/* Medication Log */}
      <section className="medication-log">
        <h2>Log</h2>
        <div className="add-medication" onClick={() => navigate("/add-medication")}>
          <span>+</span>
          <p>Add Medication</p>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/calendar")}>Calendar</button>
        <button onClick={() => navigate("/chatbot")}>Quick Q/A</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
      </nav>
    </div>
  );
};

export default HomeScreen;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/HomeScreen.css";
import Logo from "../assets/logo.png";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      alert("You need to be logged in.");
      navigate("/");
      return;
    }

    const medicationsRef = collection(db, "medications");
    const q = query(medicationsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedications(meds);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="home-screen">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={Logo} alt="REMEDII Logo" className="header-logo" />
      </div>

      {/* Header */}
      <header className="home-header">
        <h1>How are you feeling today?</h1>
      </header>

      {/* Daily Insights */}
      <section className="daily-section">
        <h2>Daily Insights & Reminders</h2>
        <ul>
          {medications.length > 0 ? (
            medications.map((med) => (
              <li key={med.id}>
                {med.icon} {med.medicationName} - Take {med.dosage} {med.frequency}.
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
        <div className="question-input">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Ask me a question!"
            onClick={() => navigate("/chatbot")}
          />
        </div>
      </section>

      {/* Medication Log */}
      <section className="medication-log">
        <h2>Log</h2>
        <div className="add-medication" onClick={() => navigate("/add-medication")}>
          <div className="add-button">
            <span>+</span>
          </div>
          <p>Add Medication</p>
        </div>
      </section>

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

export default HomeScreen;

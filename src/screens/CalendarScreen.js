import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarScreen.css";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Modal from "react-modal";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
//import BottomNavigation from "./BottomNavigation";

Modal.setAppElement("#root");

const CalendarScreen = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medicationsForDate, setMedicationsForDate] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

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
  }, []);

  const getMedicationsForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return medications.filter((med) => med.startDate <= formattedDate && med.endDate >= formattedDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const meds = getMedicationsForDate(date);
    setMedicationsForDate(meds);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="calendar-screen">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={Logo} alt="REMEDII Logo" className="header-logo" />
      </div>

      {/* Header */}
      <header>
        <h1 className="calendar-title">Medication Calendar</h1>
      </header>

      {/* Calendar */}
      <div className="calendar-container">
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const meds = getMedicationsForDate(date);
            return meds.length > 0 ? "has-medication" : null;
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="medication-modal"
        overlayClassName="medication-modal-overlay"
      >
        <h2>Medications for {selectedDate.toDateString()}</h2>
        {medicationsForDate.length > 0 ? (
          <ul>
            {medicationsForDate.map((med) => (
              <li key={med.id}>
                <strong>{med.medicationName}</strong> - {med.dosage} ({med.frequency})
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications scheduled for this date.</p>
        )}
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </Modal>

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

export default CalendarScreen;

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Calendar library
import "react-calendar/dist/Calendar.css"; // Default styles
import "../styles/CalendarScreen.css"; // Custom styles
import { auth, db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Modal from "react-modal"; // For displaying details or edits

Modal.setAppElement("#root"); // Accessibility requirement for Modal

const CalendarScreen = () => {
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

  // Get medications for the selected date
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
      <header>
        <h1>Medication Calendar</h1>
      </header>

      <div className="calendar-container">
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const meds = getMedicationsForDate(date);
            return meds.length > 0 ? "has-medication" : null;
          }}
        />
      </div>

      {/* Modal for viewing/editing medications */}
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
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default CalendarScreen;
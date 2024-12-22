import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import "../styles/ProfileScreen.css";
import { auth, db} from "../firebaseConfig";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return navigate("/");

        // Fetch user profile data
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          // setEmail(user.email); // Email comes from authentication
          setAllergies(userData.allergies || "");
          setConditions(userData.conditions || "");
        }

        // Fetch user medications
        const medsQuery = query(collection(db, "medications"), where("userId", "==", user.uid));
        const medsSnapshot = await getDocs(medsQuery);
        const meds = medsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMedications(meds);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name,
        allergies,
        conditions,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-screen">
      <header>
        <h1>Profile</h1>
      </header>

      <section className="profile-section">
        <h2>Personal Info</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {/* <label>
          Email:
          <input type="email" value={email} readOnly />
        </label> */}
      </section>

      <section className="medical-history-section">
        <h2>Medical History</h2>
        <label>
          Allergies:
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          />
        </label>
        <label>
          Conditions:
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
        </label>
      </section>

      <section className="medication-list-section">
        <h2>Current Medications</h2>
        {medications.length > 0 ? (
          <ul>
            {medications.map((med) => (
              <li key={med.id}>
                <strong>{med.medicationName}</strong> - {med.dosage} ({med.frequency})
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications added yet.</p>
        )}
      </section>

      <button className="save-button" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
};

export default ProfileScreen;
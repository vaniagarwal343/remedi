import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setProfileData(null);
        setLoading(false);
        return;
      }

      // Fetch user profile
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      // Fetch medications
      const medsQuery = query(
        collection(db, "medications"),
        where("userId", "==", user.uid)
      );
      const medsSnapshot = await getDocs(medsQuery);
      const medications = medsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const fullProfile = {
        ...userData,
        medications,
        lastUpdated: new Date().toISOString()
      };

      setProfileData(fullProfile);
      console.log("Profile data updated:", fullProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();

    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfileData();
      } else {
        setProfileData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserProfileContext.Provider value={{ 
      profileData, 
      loading,
      refreshProfile: fetchProfileData 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
        console.log("No user found");
        return;
      }

      // Fetch user profile
      console.log("Fetching profile for user:", user.uid);
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
        userId: user.uid,
        lastUpdated: new Date().toISOString()
      };

      console.log("Setting profile data:", fullProfile);
      setProfileData(fullProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfileData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await updateDoc(doc(db, "users", user.uid), newProfileData);
      await fetchProfileData(); // Refresh the profile data after update
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProfileData();

    // Set up auth listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Auth state changed - user logged in:", user.uid);
        fetchProfileData();
      } else {
        console.log("Auth state changed - no user");
        setProfileData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    profileData,
    loading,
    refreshProfile: fetchProfileData,
    updateProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
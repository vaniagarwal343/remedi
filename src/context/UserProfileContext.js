import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
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
        ...(userData || {}), // Handle case where userData is null
        medications,
        userId: user.uid,
        lastUpdated: new Date().toISOString()
      };

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

      // Get a reference to the user document
      const userRef = doc(db, "users", user.uid);

      // Use setDoc with merge option instead of updateDoc
      await setDoc(userRef, {
        name: newProfileData.name,
        allergies: newProfileData.allergies,
        conditions: newProfileData.conditions,
        lastUpdated: new Date().toISOString()
      }, { merge: true }); // This will create the document if it doesn't exist

      // Refresh the profile data
      await fetchProfileData();
      
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

export default UserProfileContext;
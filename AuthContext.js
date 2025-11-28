import React, { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep user in sync with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will automatically update user
    } catch (error) {
      // console.error("Login Error:", error.message);
      alert("Invalid credentials, please try again.");
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will automatically update user
    } catch (error) {
      // console.error("Register Error:", error.message);
      alert("Register Error: " + error.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      // console.error("Logout Error:", error.message);
      alert("Logout Error: " + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

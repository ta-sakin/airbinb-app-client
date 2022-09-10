import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../components/shared/Loading";
import auth from "../utils/firebase.init";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // signup function
  async function signup(email, password, username) {
    await createUserWithEmailAndPassword(auth, email, password);

    // update profile
    await updateProfile(auth.currentUser, {
      displayName: username,
    });

    const user = auth.currentUser;
    setCurrentUser({
      ...user,
    });
  }

  // login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function googleSignIn() {
    return signInWithPopup(auth, provider);
  }
  //reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    return signOut(auth);
  }

  const value = {
    loading,
    currentUser,
    signup,
    logout,
    login,
    resetPassword,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

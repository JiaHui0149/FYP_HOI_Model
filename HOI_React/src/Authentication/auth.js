import React, { useState, useEffect } from "react";
import "../styles/Auth2.css";
import { auth, googleProvider } from "../Firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa"; // Import the Google icon from react-icons library
import Notification from "../components/Notification"; // Import the Notification component

function Auth({ setAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(auth);
  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setAuthenticated(true);
    } catch (err) {
      setError("Invalid Password or Userame");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // If successful, set authenticated state to true
      setAuthenticated(true);
      console.log(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If the user is already authenticated, redirect them to the dashboard
    if (auth.currentUser) {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome to Our Dashboard</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Display error message */}
        <button className="auth-button" onClick={signIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        {/* <button
          className="auth-google-button"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <FaGoogle className="google-icon" /> Sign In With Google
        </button> */}
      </div>
      {error && (
        <div className="notification-container">
          <Notification message={error} />
        </div>
      )}
    </div>
  );
}

export default Auth;

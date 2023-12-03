import React from "react";
import { auth } from "../Firebase/firebase";
import { signOut } from "firebase/auth";
import PropTypes from "prop-types";

function Logout({ history }) {
  const handleLogout = async () => {
    console.log("Attempting to log out...");
    try {
      await signOut(auth);
      console.log("Successfully logged out");
      localStorage.setItem("authenticated", "false"); // Set the value to "false" on logout
      history.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Log Out
    </button>
  );
}

Logout.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Logout;

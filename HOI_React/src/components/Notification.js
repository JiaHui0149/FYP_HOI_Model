import React, { useEffect, useState } from "react";
import "../styles/Notification.css";

function Notification({ message }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);

      // Automatically hide the notification after 5 seconds
      const timeout = setTimeout(() => {
        setShow(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div className={`notification ${show ? "show" : ""}`}>
      <div className="notification-content">{message}</div>
    </div>
  );
}

export default Notification;

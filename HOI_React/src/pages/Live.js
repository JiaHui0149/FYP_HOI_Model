import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import firebaseConfig from "../Firebase/firebase"; // Adjust the import path
import "../styles/Live.css";

const app = initializeApp(firebaseConfig);

function Live() {
  const videoRefs = [useRef(null), useRef(null), useRef(null)];
  const [selectedLocation, setSelectedLocation] = useState(0);

  useEffect(() => {
    async function setupCameras() {
      for (let i = 0; i < videoRefs.length; i++) {
        const videoElement = videoRefs[i].current;

        if (i === selectedLocation && videoElement) {
          try {
            const cameras = await navigator.mediaDevices.enumerateDevices();
            const cameraDevices = cameras.filter(
              (device) => device.kind === "videoinput"
            );

            if (cameraDevices.length > i) {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: cameraDevices[i].deviceId },
              });
              videoElement.srcObject = stream;
            } else {
              console.log(`No camera available for location ${i}`);
            }
          } catch (error) {
            console.error(`Error accessing camera ${i}:`, error);
          }
        } else {
          if (videoElement) {
            videoElement.srcObject = null;
          }
        }
      }
    }

    setupCameras();
  }, [selectedLocation]);

  const locations = ["Mall", "Park", "Street"];

  const handleLocationChange = (index) => {
    setSelectedLocation(index);
    console.log(`Selected location changed to ${locations[index]}`);
  };

  // Function to fetch the latest 'id' from Firestore and increment it
  const fetchLatestIdAndIncrement = async () => {
    try {
      const firestore = getFirestore(app);
      const framesCollection = collection(firestore, "Frames");
      const querySnapshot = await getDocs(
        query(framesCollection, orderBy("ID", "desc"), limit(1))
      );
      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0];
        const latestId = latestDoc.data().ID;
        // Increment the latest ID by 1 and convert it back to a string
        const incrementedId = (parseInt(latestId) + 1).toString();
        return incrementedId;
      } else {
        // No documents in the collection, start with an initial 'id'
        return "100001";
      }
    } catch (error) {
      console.error("Error fetching and incrementing latest ID:", error);
      // Return a default 'id' in case of an error
      return "100001";
    }
  };

  // Function to capture frames and send them to Cloud Firestore
  const captureFrameAndSend = async (videoIndex) => {
    // Fetch the latest 'id' from Firestore and increment it
    const latestId = await fetchLatestIdAndIncrement();

    const videoElement = videoRefs[videoIndex].current;

    if (!videoElement) {
      console.log(`No video element found for location ${videoIndex}`);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert the canvas data to a base64-encoded data URL
    const dataURL = canvas.toDataURL("image/jpeg");

    console.log(`Captured frame for location ${videoIndex}:`, dataURL);

    // // Access Firestore and add the captured frame as a document
    try {
      const firestore = getFirestore(app); // Initialize Firestore with the Firebase app instance

      // Create a reference to the 'frames' collection
      const framesCollection = collection(firestore, "Frames");

      // Add a new document to the 'frames' collection with the incremented 'id'
      await addDoc(framesCollection, {
        ID: latestId,
        location: locations[selectedLocation],
        image: dataURL,
        timestamp: serverTimestamp(), // Use the server timestamp
      });

      console.log(
        `Frame for location ${videoIndex} uploaded to Firestore with ID: ${latestId}`
      );
      // Handle the upload success as needed
    } catch (error) {
      console.error("Error uploading frame to Firestore:", error);
    }
  };

  // Automatically capture frames every 5 seconds
  useEffect(() => {
    const captureInterval = setInterval(() => {
      captureFrameAndSend(selectedLocation);
    }, 5000); // 5000 milliseconds = 5 seconds

    console.log(`Frame capture interval started for location ${selectedLocation}`);

    return () => {
      clearInterval(captureInterval);
      console.log(`Frame capture interval stopped for location ${selectedLocation}`);
    };
  }, [selectedLocation]);

  return (
    <div className="live">
      <div className="sidebar">
        <h2>Locations</h2>
        <ul>
          {locations.map((location, index) => (
            <li
              key={index}
              className={
                selectedLocation === index ? "selected clickable" : "clickable"
              }
              onClick={() => handleLocationChange(index)}
            >
              {location}
            </li>
          ))}
        </ul>
      </div>
      <div className="live-container">
        <div className="live-content">
          <div className="live-video">
            {videoRefs.map((ref, index) => (
              <video
                key={index}
                ref={ref}
                autoPlay={index === selectedLocation}
                style={{
                  transform: "scaleX(-1)",
                  display: index === selectedLocation ? "block" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Live;
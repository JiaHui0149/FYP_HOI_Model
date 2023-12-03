import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { auth, googleProvider } from "../Firebase/firebase";

function Home() {
  const [predictionList, setPredictionList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [aggressorList, setAggressorList] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);

  console.log("Authentication Information: ", auth);

  let fetchFirebaseData = async (string, setDataFunction) => {
    try {
      let endpoint = `http://127.0.0.1:8000/hoi/${string}`;
      console.log("Endpoint: ", endpoint);
      let response = await fetch(endpoint);
      let data = await response.json();
      console.log("DATA: ", data);
      setDataFunction(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to fetch the latest alert
  const fetchLatestAlert = async () => {
    try {
      let endpoint = "http://127.0.0.1:8000/hoi/latest_record";
      let response = await fetch(endpoint);
      let data = await response.json();
      console.log("latest Alert", data);
      setLatestAlert(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFirebaseData("prediction", setPredictionList);
    fetchFirebaseData("videos", setVideoList);
    fetchFirebaseData("aggressors", setAggressorList);
    fetchLatestAlert();
  }, []);

  const dashboardData = {
    totalVideos: videoList.length,
    detectedIncidents: predictionList.length,
    detectedAggressors: aggressorList.length,
  };

  return (
    <div className="home">
      <div className="headerContainer">
        <div className="dataBox blue">
          <h1>{dashboardData.totalVideos}</h1>
          <p>Total Locations</p>
        </div>
        <div className="dataBox orange">
          <h1>3</h1>
          <p>Registered Users</p>
        </div>
        <div className="dataBox green">
          <h1>{dashboardData.detectedIncidents}</h1>
          <p>Detected Incidents</p>
        </div>
      </div>
      {latestAlert && (
        <div className="latestAlert">
          <div className="alert-content">
            <h2>Latest Alert</h2>
            <div className="alert-box">
              <h3>Code ID: {latestAlert.code_id}</h3>
              <p>Prediction Score: {latestAlert.wd_scores}</p>
              <p>Last Appeared Time: {latestAlert.timestamp}</p>
              <div className="image-container">
                {latestAlert.image && (
                  <img
                    src={`data:image/jpeg;base64,${latestAlert.image}`}
                    alt="CCTV"
                    className="image-fixed-size"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';

const AlertDetails = ({ alert }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [criminalDetectedSrc, setCriminalDetectedSrc] = useState("");

  useEffect(() => {
    if (alert.image) {
      // Convert the Base64 string to URL for the first image
      const imageUrl = `data:image/jpeg;base64,${alert.image}`;
      setImageSrc(imageUrl);
    }

    if (alert.criminalDetected) {
      // Convert the Base64 string to URL for the second image
      const criminalDetectedUrl = `data:image/jpeg;base64,${alert.criminalDetected}`;
      setCriminalDetectedSrc(criminalDetectedUrl);
    }
  }, [alert.image, alert.criminalDetected]);

  return (
    <div className="alert-box">
      <h3>Code ID: {alert.code_id}</h3>
      <p>Prediction Score: {alert.wd_scores}</p>
      {/* <p>Last Appeared Location: {alert.location}</p> */}
      <p>Last Appeared Time: {alert.timestamp}</p>

      {/* Container for side-by-side images */}
      <div className="image-container">
        {/* Display the first image */}
        {imageSrc && <img src={imageSrc} alt="CCTV" className="image-fixed-size" />}

        {/* Add another image */}
        {criminalDetectedSrc && <img src={criminalDetectedSrc} alt="" className="larger-image" />}
      </div>
    </div>
  );
};

export default AlertDetails;

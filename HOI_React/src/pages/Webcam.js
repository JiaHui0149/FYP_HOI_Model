import React, { Component } from "react";
import "../styles/WebcamViewer.css"; // Include your CSS file

class WebcamViewer extends Component {
  constructor() {
    super();
    this.state = {
      streaming: false,
      frameUrl: "http://127.0.0.1:8000/hoi/webcam_feed",
    };
  }

  handleStartStreaming = () => {
    this.setState({ streaming: true });
  };

  handleStopStreaming = () => {
    this.setState({ streaming: false });
  };

  render() {
    const { streaming, frameUrl } = this.state;

    return (
      <div className="webcam-container">
        <h1 className="webcam-title">Live Webcam Streaming</h1>
        {streaming ? (
          <img src={frameUrl} alt="Frame" className="webcam-frame" />
        ) : (
          <p>Click 'Start Streaming' to begin.</p>
        )}
        <button
          className="webcam-button"
          onClick={
            streaming ? this.handleStopStreaming : this.handleStartStreaming
          }
        >
          {streaming ? "Stop Streaming" : "Start Streaming"}
        </button>
      </div>
    );
  }
}

export default WebcamViewer;

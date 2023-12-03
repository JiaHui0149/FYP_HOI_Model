import "./App.css";
import Home from "./pages/Home";
import Live from "./pages/Live";
import Alerts from "./pages/Alerts";
import Auth from "./Authentication/auth";
import Navbar from "./components/Navbar";
import WebcamViewer from "./pages/Webcam";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    if (localStorage.getItem("authenticated") === "true") {
      setAuthenticated(true);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/auth">
            {!authenticated ? (
              <Auth setAuthenticated={setAuthenticated} /> // Pass the handleLogin function to the Auth component
            ) : (
              <Redirect to="/" /> // Redirect to the dashboard if already authenticated
            )}
          </Route>
          <Route>
            <Navbar />
            <Switch>
              <Route path="/auth" exact component={Auth} />
              <Route path="/" exact component={Home} />
              <Route path="/live" exact component={Live} />
              <Route path="/alerts" exact component={Alerts} />
              <Route path="/webcam" exact component={WebcamViewer} />
              {/* Add more routes for About, Contact, SignInSide, etc. */}
            </Switch>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

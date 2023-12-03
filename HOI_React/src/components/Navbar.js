import React, { useState } from "react";
import Logo from "../assets/logo.jpg";
import Searchbar from "./Searchbar";
import { Link, useHistory } from "react-router-dom";
import Logout from "./Logout";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const history = useHistory();

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} />
        <Link to="/"> Main </Link>
        <Link to="/webcam"> Webcam </Link>
        <Link to="/alerts"> Alerts </Link>
        
        {/* <Link to="/home"> Contact </Link> */}
        {/* <Link to="/signin"> Sign In </Link> */}

        <div className="hiddenLinks">
          <Link to="/"> Main </Link>
          <Link to="/alerts"> Alerts </Link>
          <Link to="/home"> Contact </Link>
          {/* <Link to="/signin"> Sign In </Link> */}
        </div>
      </div>
      <div className="rightSide">
       
      </div>
      <Logout history={history} />
    </div>
  );
}

export default Navbar;

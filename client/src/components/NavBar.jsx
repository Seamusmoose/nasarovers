import React from "react";
import MarsRover from "./MarsRover";
import MarsWeather from "./MarsWeather";
import Home from "./Home";

const NavBar = ({ setIsShow }) => {
  return (
    <div>
      <ul className="nav__container">
        <li className="nav-item">
          <button onClick={() => setIsShow(true)}>Weather</button>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;

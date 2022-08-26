import "./App.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./components/Layout";
import NavBar from "./components/NavBar";
import MarsRover from "./components/MarsRover";
import MarsWeather from "./components/MarsWeather";

function App() {
  const [isShow, setIsShow] = useState(false);

  // const getSol = (sol) => {};

  return (
    <>
      <NavBar setIsShow={setIsShow} />
      <Layout>
        <div className="content__container">
          <MarsRover />
        </div>

        <div
          className={
            isShow ? "sidebar__container--expand" : "sidebar__container"
          }
        >
          <button onClick={() => setIsShow(false)}>close</button>
          <div className="weather__container">{<MarsWeather />}</div>
        </div>
      </Layout>
    </>
  );
}

export default App;

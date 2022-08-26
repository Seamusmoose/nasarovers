import React, { useState, useEffect } from "react";
import axios from "axios";
import RoverCard from "./RoverCard";
import { Modal } from "./Modal";
import "../rover.css";

const camerasList = [
  "FHAZ",
  "RHAZ",
  "MAST",
  "CHEMCAM",
  "MAHLI",
  "MARDI",
  "NAVCAM",
  "PANCAM",
  "MINITES",
];
const size = 48;
const currentRovers = ["Curiosity", "Opportunity", "Spirit"];
const date = new Date().toISOString().slice(0, 10);

const MarsRover = () => {
  const [roverData, setRoverData] = useState([]);
  const [roverVal, setRoverVal] = useState("Curiosity");
  const [cameraState, setCameraState] = useState("FHAZ");
  const [filterData, setFilterData] = useState([]);
  const [queryData, setQueryData] = useState({
    latestEarthDate: date,
    maxDate: date,
    cameras: camerasList,
    sol: null,
  });


  const URLQUERY = `https://api.nasa.gov/mars-photos/api/v1/manifests/${roverVal}/?&api_key=${process.env.REACT_APP_ROVER2_KEY}`;
  const URLRESULT = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverVal}/photos?earth_date=${queryData.latestEarthDate}&api_key=${process.env.REACT_APP_ROVER2_KEY}`;
  // props.getSol(queryData.sol);

  useEffect(() => {
    const fetchRoverQueryOnMount = async () => {
      const { data } = await axios.get(URLQUERY);
      let recievedQueryData = data.photo_manifest.photos;
      let latestDateResult = recievedQueryData[recievedQueryData.length - 1];

      setQueryData((queryData) => {
        return {
          ...queryData,
          latestEarthDate: latestDateResult.earth_date,
          maxDate: latestDateResult.earth_date,
          cameras: latestDateResult.cameras,
          sol: latestDateResult.sol,
        };
      });
    };

    fetchRoverQueryOnMount();
  }, []);

  useEffect(() => {
    const fetchRoverResult = async () => {
      const { data } = await axios.get(URLRESULT);
      const camerasQueryResult = data.photos.map((i) => i.camera.name);
      let uniqueCameras = [...new Set(camerasQueryResult)];

      setQueryData((prevVal) => {
        return {
          ...prevVal,
          cameras: [...uniqueCameras],
        };
      });
      setRoverData([]);
      setRoverData([...data.photos]);
    };
    fetchRoverResult();
  }, [queryData.latestEarthDate, roverVal]);

  useEffect(() => {
    setFilterData(roverData.filter((el) => el.camera.name === cameraState));
  }, [roverData, setFilterData, cameraState]);

  const handleDateChange = (e) => {
    setQueryData((prevState) => {
      return {
        ...prevState,
        latestEarthDate: e.target.value,
      };
    });
  };

  const renderedCameras = queryData.cameras.map((cam) => {
    return <option key={cam}>{cam}</option>;
  });

  const renderedRovers = currentRovers.map((rover) => {
    return <option key={rover}>{rover}</option>;
  });

  const RoverDateSelectorMin = () => {
    switch (roverVal) {
      case "Curiosity":
        return "2012-08-06";
      case "Opportunity":
        return "2004-01-26";
      case "Spirit":
        return "2004-01-05";
      default:
        return "2012-08-06";
    }
  };
  const RoverDateSelectorMax = () => {
    switch (roverVal) {
      case "Curiosity":
        return queryData.maxDate;
      case "Opportunity":
        return "2018-06-11";
      case "Spirit":
        return "2010-03-22";
      default:
        return queryData.maxDate;
    }
  };

  return (
    <div className="RoverImages__Container">
      <select
        placeholder="select Rover"
        name="RoverOpt"
        onChange={(e) => setRoverVal(e.target.value)}
        value={roverVal}
      >
        {renderedRovers}
      </select>

      <select
        name="CameraOPt"
        value={cameraState}
        onChange={(e) => setCameraState(e.target.value)}
      >
        {renderedCameras}
      </select>

      <input
        name="date"
        type="date"
        min={RoverDateSelectorMin(roverVal)}
        max={RoverDateSelectorMax(roverVal)}
        value={queryData.latestEarthDate}
        onChange={handleDateChange}
      />
      <div className="grid__container">
        {filterData.length === 0 ? (
          <div>no Data provided</div>
        ) : (
          filterData
            .slice(0, size)
            .map(({ earth_date, img_src, camera, id, sol }) => {
              return (
                <div key={id}>
                  <RoverCard
                    earthDate={earth_date}
                    image={img_src}
                    camera={camera.name}
                    sol={sol}
                  />
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default MarsRover;

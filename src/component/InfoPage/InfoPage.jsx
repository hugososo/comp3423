import React, { useEffect, useState, useContext, useRef } from "react";
import { StudentContext, GameProgressContext } from "../../context/appContext";
import { homeSocket } from "../Home/Home";
import "./InfoPage.css";

function InfoPage() {
  const { studentID, setStudentID } = useContext(StudentContext);
  const [textSpace, setTextSpace] = useState(10+studentID.length * 16);
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);

  useEffect(() => {
      homeSocket.on("inputNum", (data) => {
        console.log("inputNum");
        setStudentID((prevState) =>
          prevState.length < 25 ? prevState + data.value : prevState
        );
        setTextSpace((prevState) =>
          prevState < 25 * 16 ? prevState + 16 : prevState
        );
      });
      homeSocket.on("removeNum", (data) => {
        console.log("removeum");
        setStudentID((prevState) =>
          prevState >= 1 ? prevState.slice(0, -1) : prevState
        );
        setTextSpace((prevState) =>
          prevState > 10 ? prevState - 16 : prevState
        );
      });

      return () => {
        setTextSpace(10);
        homeSocket.off('inputNum')
        homeSocket.off('removeNum')
      }
  }, []);

  return (
    <>
      <div className="title-container">
        <h1 className="info-title">Input Your ID</h1>
      </div>
      <div className="id-field">
        <div className="id-text">{studentID}</div>
        <div className="id-field-after" style={{ left: textSpace }}></div>
      </div>
    </>
  );
}

export default InfoPage;

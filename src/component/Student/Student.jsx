import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import CircleButton from "../CircleButton/CircleButton";
import { GameProgressContext } from "../../context/appContext";
import "./Student.css";

const studentSocket = io("http://15.164.241.161");

function Student(props) {
  const name = "student";
  const room = props.match.params.socketID;
  const numArr = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "<", "OK"];
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);

  useEffect(() => {
    studentSocket.on("connect", () => {
      studentSocket.emit("join", { name, room: room }, () => {});
    });

    studentSocket.on("INFO", (data) => {
      setGameProgess(data.action);
    });

    studentSocket.on("GAMESTART", (data) => {
      setGameProgess(data.action);
    });

    studentSocket.on("GAMEEND", (data) => {
      setGameProgess(data.action);
    });
    return () => {
      studentSocket.disconnect();
      studentSocket.off();
    };
  }, []);

  return (
    <>
      <div id="student">
        <div className="container">
          <div className="circle-button-container">
            {numArr.map((e, i) => (
              <CircleButton value={e} key={e} socket={studentSocket} >
                {e}
              </CircleButton>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Student;

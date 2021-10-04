import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import LongButton from "../LongButton/index.js";
import Answering from "../Answering/index.js";
import GameEnd from "../GameEnd/index.js";
import { GameProgressContext } from "../../context/appContext";
import "./Parent.css";

export const parentSocket = io(`${process.env.REACT_APP_PUBLIC_IP}`);

function Parent(props) {
  const name = "parent";
  const room = props.match.params.socketID;
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);
  const [studentID, setStudentID] = useState("");
  const [finalScore, setFinalScore] = useState("");

  useEffect(() => {
    parentSocket.on("connect", () => {
      parentSocket.emit("join", { name, room: room }, () => { });
    });

    parentSocket.on("INFO", (data) => {
      setGameProgess(data.action);
    });

    parentSocket.on("GAMESTART", (data) => {
      setGameProgess(data.action);
    });

    parentSocket.on("GAMEEND", (data) => {
      setStudentID(data.studentID);
      setFinalScore(data.score);
      setGameProgess(data.action);
    });
    return () => {
      parentSocket.disconnect();
      parentSocket.off();
    };
  }, []);

  return (
    <>
      <div id="parent">
        <div className="container">
          {(function () {
            switch (gameProgess) {
              case "GAMEEND":
                return <GameEnd studentID={studentID} finalScore={finalScore} socket={parentSocket}/>;
              case "GAMESTART":
              case "INFO":
                return <Answering />;
              default:
                return <div className="long-button-container flex-c">
                  <LongButton name="Start" event="INFO" action="INFO" socket={parentSocket} />
                </div>
            }
          })()}
        </div>
      </div>
    </>
  );
}

export default Parent;

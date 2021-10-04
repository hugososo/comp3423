import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import LongButton, { LongButtonLocal } from "../LongButton/LongButton";
import { GameProgressContext, TeacherModeContext } from "../../context/appContext";
import GameEnd from "../GameEnd/index.js";
import "./Teacher.css";
import { PROD } from "../../config.js"

export const teacherSocket = io(PROD);

function Teacher(props) {
  const name = "teacher";
  const room = props.match.params.socketID;
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);
  const { teacherMode, setTeacherMode } = useContext(TeacherModeContext);
  const [studentID, setStudentID] = useState("");
  const [finalScore, setFinalScore] = useState("");

  useEffect(() => {
    teacherSocket.on("connect", () => {
      teacherSocket.emit("join", { name, room: room }, () => { });
    });

    teacherSocket.on("INFO", (data) => {
      setGameProgess(data.action);
    });

    teacherSocket.on("GAMESTART", (data) => {
      setGameProgess(data.action);
    });

    teacherSocket.on("GAMEEND", (data) => {
      setStudentID(data.studentID);
      setFinalScore(data.score);
      setGameProgess(data.action);
    });
    return () => {
      teacherSocket.disconnect();
      teacherSocket.off();
    };
  }, []);

  const changeMode = () => {
    setTeacherMode("SOCIAL");
  }

  return (
    <>
      <div id="parent">
        <div className="container">
          <div className="long-button-container flex-c">
            {(function () {
              if (gameProgess === "GAMEEND") {
                return <GameEnd studentID={studentID} finalScore={finalScore} socket={teacherSocket}/>;
              } else {
                switch (teacherMode) {
                  case "SOCIAL":
                    return <SocialMode />;
                  default:
                    return <>
                      <LongButtonLocal name="Social Mode" onClick={() => { changeMode(); }} />
                      {/* <LongButton name="Neutral Mode" action="NEUTRAL" socket={teacherSocket} /> */}
                      <LongButton name="Start" event="INFO" action="INFO" socket={teacherSocket} />
                    </>
                }
              }
            })()}
          </div>
        </div>
      </div>
    </>
  );
}

function SocialMode() {

  const { setTeacherMode } = useContext(TeacherModeContext);

  const changeMode = () => {
    setTeacherMode("NORMAL");
  }

  return (
    <>
      <LongButtonLocal name="< Back" color="green" onClick={() => { changeMode(); }} />
      <LongButton name="Cheer" event="playAudio" action="cheer" socket={teacherSocket} />
      <LongButton name="Encourage" event="playAudio" action="encourage" socket={teacherSocket} />
      <LongButton name="Sad" event="playAudio" action="sad" socket={teacherSocket} />
      <LongButton name="Wow" event="playAudio" action="wow" socket={teacherSocket} />
    </>
  );
}

export default Teacher;

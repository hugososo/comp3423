import React from "react";
import LongButton from "../LongButton/index.js";
import "./GameEnd.css";

function GameEnd(props) {
  return (
    <>
      <div class="subtitle" style={{color:"black"}}>{props.studentID}</div>
      <div class="subtitle" style={{color:"black"}}>Final Score</div>
      <div class="subtitle" style={{color:"black"}}>{props.finalScore}</div>
      {/* <LongButton name="History Record" action="RECORD" socket={props.socket}/> */}
      <LongButton name="Continue" event="restart" action="restart" socket={props.socket} />
    </>
  );
}

export default GameEnd;

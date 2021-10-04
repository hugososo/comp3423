import React from "react";
import "./LongButton.css";

function LongButton(props) {

  const actionClick = (value) => {
    console.log(value);
    props.socket.emit(props.event, props.action, (error) => {
      console.log("callback");
    });
  }

  return (
    <button style={{color:props.color}} className="long-btn" value={props} onClick={(e) => actionClick(e.target.value)}>{props.name}</button>
  );
}

export function LongButtonLocal(props) {

  const actionClick = (value) => {
    props.onClick();
  }

  return (
    <button style={{backgroundColor:props.color}} className="long-btn" onClick={() => actionClick()}>{props.name}</button>
  );
}

export default LongButton;

import React, {useContext} from "react";
import "./CircleButton.css";
import { GameProgressContext } from "../../context/appContext";

function CircleButton({ value, socket }) {
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);

  const btnClick = (value) => {
    if (value === "<") {
      socket.emit("removeNum", (error) => {
        console.log(error);
      });
    } else if (value === "OK") {
      if(gameProgess==="INFO") {
        socket.emit("submitID", (error) => {
          console.log(error);
        });
      } else if (gameProgess === "GAMESTART") {
        socket.emit("submitAns", (error) => {
          console.log(error);
        });
      }
    } else {
      socket.emit("inputNum", value, (error) => {
        console.log(error);
      });
    }
  };

  return (
    <button
      className="circle-btn"
      value={value}
      onClick={(e) => btnClick(e.target.value)}
    >
      {value}
    </button>
  );
}

export default CircleButton;

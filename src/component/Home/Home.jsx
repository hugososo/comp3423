import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import CharacterQRCode from "../CharacterQRCode/index.js";
import InfoPage from "../InfoPage/index.js";
import GamePage from "../GamePage/index.js";
import { GameProgressContext } from "../../context/appContext";
// import ReactCSSTransitionGroup from "react-transition-group";
import "./Home.css";

export const homeSocket = io(`${process.env.REACT_APP_PUBLIC_IP}`);

function Home() {
  const [socketID, setSocketID] = useState("");
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);

  const name = "ui";

  useEffect(() => {
    console.log(process.env.REACT_APP_PUBLIC_IP);
    homeSocket.on("connect", () => {
      console.log("connect");
      setSocketID(homeSocket.id);
      homeSocket.emit("join", { name, room: homeSocket.id }, () => {});
    });

    homeSocket.on("INFO", (data) => {
      console.log(data);
      setGameProgess(data.action);
    });

    homeSocket.on("GAMESTART", (data) => {
      console.log(data);
      setGameProgess(data.action);
    });

    homeSocket.on("GAMEEND", (data) => {
      console.log(data);
      setGameProgess(data.action);
    });

    return () => {
      console.log("home page unmounted");
      homeSocket.disconnect();
      homeSocket.off();
    };
  }, []);

  return (
    <>
      <div id="home">
        <div className="container">
          {(function () {
            switch (gameProgess) {
              case "INFO":
                return <InfoPage />;
              case "GAMESTART":
              case "GAMEEND":
                return <GamePage />;
              default:
                return <WaitingPage socketID={socketID} />;
            }
          })()}
        </div>
      </div>
    </>
  );
}

const WaitingPage = (props) => {
  return (
    <>
      <div className="title-container">
        <h1 className="title">Robot Tutor</h1>
        <img src="" alt="" />
      </div>
      <div className="subtitle">
        Please scan the corresonding QR code by your smartphone to open the
        console
      </div>
      <div className="qr-container">
        <CharacterQRCode
          name="teacher"
          socketID={props.socketID}
          color="#ff9900"
        />
        <CharacterQRCode
          name="student"
          socketID={props.socketID}
          color="#30cf08"
        />
        <CharacterQRCode
          name="parent"
          socketID={props.socketID}
          color="#33f8f8"
        />
      </div>
    </>
  );
};

export default Home;

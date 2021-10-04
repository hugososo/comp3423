import React from "react";
import answering from "../../assets/dogrun.gif";
import "./Answering.css";

function Answering() {
  return (
    <>
    <div id="answering-container">
      <img src={answering} alt="Answering" id="dogrun" />
      <div class="subtitle" style={{color:"black"}}>Answering...</div>
    </div>
    </>
  );
}

export default Answering;

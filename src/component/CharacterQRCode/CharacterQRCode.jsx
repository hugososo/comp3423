import React from "react";
import QRCode from "qrcode.react"
import { Link } from "react-router-dom";
import "./CharacterQRCode.css";

function CharacterQRCode({name,socketID,color}) {

  return (
    <div className="flex-c h-220">
      <Link to={`${name}/${socketID}`} style={{textDecoration: "none"}}><div className="qr-title" style={{color: color}}>{name}</div></Link>
      {/* <QRCode value={`${window.location.href+name}/${socketID}`} bgColor="transparent" level="M" size={162}/> */}
      <QRCode value={`http://192.168.1.173:3000/${name}/${socketID}`} bgColor="transparent" level="M" size={162}/>
    </div>
  );
}

export default CharacterQRCode;

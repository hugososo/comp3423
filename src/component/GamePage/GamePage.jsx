import React, { useEffect, useState, useContext, useRef } from "react";
import { StudentContext, GameProgressContext } from "../../context/appContext";
import { homeSocket } from "../Home/Home";
import "./GamePage.css";
import hanabi from '../../assets/sparkles-fireworks.gif';
import wow from "../../assets/wow.mp3";
import encourage from "../../assets/encourage.mp3";
import sad from "../../assets/sad.mp3";
import cheer from "../../assets/tuturuu.mp3";


export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function GamePage() {
  const [question, setQuestion] = useState([
    getRandomInt(1, 10),
    getRandomInt(1, 10),
  ]);
  const [answerSpace, setAnswerSpace] = useState(10);
  const [ans, setAns] = useState("");
  const [score, setScore] = useState(0);
  const { studentID, setStudentID } = useContext(StudentContext);
  const { gameProgess, setGameProgess } = useContext(GameProgressContext);
  const ansRef = useRef();
  const questionRef = useRef();
  const [questionCount, setQuestionCount] = useState(0);
  const [comment, setComment] = useState("");
  const wowAudio = new Audio(wow);
  const encourageAudio = new Audio(encourage);
  const sadAudio = new Audio(sad);
  const cheerAudio = new Audio(cheer);
  const audio = [wowAudio, encourageAudio, cheerAudio, sadAudio]; 
  // const answerSpaceRef = useRef(answerSpace);
  // const scoreRef = useRef(score);

  useEffect(() => {

    homeSocket.on("GAMESTART", (data) => {
      setAns("");
      setAnswerSpace(10);
      setScore(0);
      setQuestionCount(0);
      setComment("");
    });

    homeSocket.on("inputNum", (data) => {
      setAns((prevState) =>
        prevState.length < 8 ? prevState + data.value : prevState
      );
      setAnswerSpace((prevState) =>
        prevState < 8 * 16 ? prevState + 16 : prevState
      );
    });

    homeSocket.on("removeNum", (data) => {
      setAns((prevState) =>
        prevState >= 1 ? prevState.slice(0, -1) : prevState
      );
      setAnswerSpace((prevState) =>
        prevState > 10 ? prevState - 16 : prevState
      );
    });

    homeSocket.on("playAudio", (data) => {
      audio.forEach((value)=>{
        value.pause();
        value.currentTime=0;
      })
      switch (data.action) {
        case "cheer":
          cheerAudio.play();
          break;
        case "encourage":
          encourageAudio.play();
          break;
        case "sad":
          sadAudio.play();
          break;
        case "wow":
          wowAudio.play();
          break;
        default:
          audio.forEach((value)=>{
            value.pause();
            value.currentTime=0;
          })
      }
    });

    homeSocket.on("CHECK_ANS", () => {
      if (parseInt(ansRef.current?.textContent) === eval(questionRef.current?.textContent.replace(/x/, "*"))) {
        setScore((prevState) => prevState + 10);
        setAns("");
        setAnswerSpace(10);
        setQuestion([getRandomInt(1, 10), getRandomInt(1, 10)]);
      } else {
        setAns("");
        setAnswerSpace(10);
        setQuestion([getRandomInt(1, 10), getRandomInt(1, 10)]);
      }
      setQuestionCount((prevState) => prevState + 1);
    });

    return () => {
      audio.forEach((value)=>{
        value.pause();
        value.currentTime=0;
      })
    }
  }, []);

  useEffect(() => {
    if (questionCount === 50) {
      console.log("end");
      if (score < 100) {
        setComment("Need to work harder!");
      } else if (score < 250) {
        setComment("Keep Going!");
      } else {
        setComment("Well done!");
      }
      homeSocket.emit("END", { studentID, score }, (callback) => {
        setGameProgess(callback.action);
      });
    }
  }, [questionCount]);

  return (
    <>
      <div id="monitor-bg">
        <div id="monitor">
          {gameProgess === "GAMEEND" ? (
            <>
              <img src={hanabi} alt="spark" id="hanabi" />
              <div id="comment">{comment}</div>
              <div id="final-score-title">Final Score</div>
              <div id="final-score"><span>{score}</span> / 500</div>
            </>
          ) : (
            <>
              <div id="score">
                Score: <span>{score}</span> / 500
              </div>
              <div id="questionCount">
                Question: <span>{questionCount}</span> / 50
              </div>
              <div id="question" ref={questionRef}>
                {question[0]} x {question[1]}
              </div>
              <div className="answer-field">
                <div className="answer-text" ref={ansRef}>
                  {ans}
                </div>
                <div
                  className="answer-field-after"
                  style={{ left: answerSpace }}
                ></div>
              </div>
            </>
          )}
        </div>
        {/* <div>Welcome {studentID === "" ? "Test" : studentID}</div> */}
      </div>
    </>
  );
}

export default GamePage;

import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./component/Home/index.js";
import Student from "./component/Student/index.js";
import Parent from "./component/Parent/index.js";
import Teacher from "./component/Teacher/index.js";
import { StudentContext, GameProgressContext, TeacherModeContext } from "./context/appContext";
import "./App.css";

function App() {

  const [studentID, setStudentID] = useState("");
  const [gameProgess, setGameProgess] = useState("WAITING");
  const [teacherMode, setTeacherMode] = useState("NORMAL");
  const studentIDMemo = useMemo(() => ({ studentID, setStudentID }), [studentID, setStudentID]);

  return (
    <Router>
      <Switch>
        <StudentContext.Provider value={studentIDMemo}>
          <GameProgressContext.Provider value={{ gameProgess, setGameProgess }}>
            <TeacherModeContext.Provider value={{ teacherMode, setTeacherMode }}>
              <Route path={"/"} exact component={Home}></Route>
              <Route path={"/student/:socketID"} component={Student}></Route>
              <Route path={"/parent/:socketID"} component={Parent}></Route>
              <Route path={"/teacher/:socketID"} component={Teacher}></Route>
            </TeacherModeContext.Provider>
          </GameProgressContext.Provider>
        </StudentContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;

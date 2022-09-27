import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";

export default function App() {
  //the array of loadedQuestions that was is fetched from API
  let [loadedQuestions, setLoadedQuestions] = React.useState([0]);
  let results = [];
  let answers = [];

  async function fetchData() {
    //Async await syntax usage only
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    results = data.results;
    return results;
  }

  useEffect(async () => {
    //Here we call fetch data but is an asynchronous method. We need to wait her to get results, and use them to render to the dom.
    // But we cannot use await without a wrapped async function. Whenever we see an await keyword, is always going together with an
    //async keyword
    results = await fetchData();
    fetchData();

    //We follow up with using the data here! Setting them, (setLoadedQuestions), and the rest of the rendering logic...
    loadedQuestions = results;
    setLoadedQuestions(results);

    //adding the correct answer to incorrect_answers array
    for (let obj of loadedQuestions)
      obj.incorrect_answers.splice(
        Math.floor(Math.random() * 4),
        0,
        obj.correct_answer
      );

    console.log(loadedQuestions);
  }, []);

  const [isClicked, setIsClicked] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [beforeFinish, setBeforeFinish] = React.useState("");

  //results is undefined when promise has not brought data yet. I must fix this bug........
  //setTimeout only for testing....
  setTimeout(() => {
    answers = loadedQuestions[currentQuestion].incorrect_answers.map(
      (element) => (
        <li>
          <span
            onClick={() => handleClick(element)}
            style={{ cursor: "pointer" }}
            className={isClicked ? textColor(element) : "bg"}
          >
            {element}
          </span>
        </li>
      )
    );

    setBeforeFinish(
      <div>
        <h5 className="m-3" style={{ textDecoration: "underline" }}>
          {loadedQuestions[currentQuestion].question}
        </h5>
        <ol style={{ listStyleType: "lower-latin" }}>{answers}</ol>
        <button
          onClick={() => nextQuestionFunction()}
          style={{ backgroundColor: "#0c88fb", color: "white", marginLeft: 10 }}
        >
          Next Question
        </button>
        <h5 style={{ marginTop: 15, marginLeft: 10 }}>
          Your score is{" "}
          <span style={{ color: "#0c88fb", fontWeight: "bold" }}>{score}</span>!
        </h5>
      </div>
    );
  }, 1000);

  const afterFinish = (
    <div>
      <h1>Finished!</h1>
      <h5>
        Your Score is{" "}
        <span style={{ color: "#0c88fb", fontWeight: "bold" }}>{score}</span>
      </h5>
      <button
        onClick={() => tryAgain()}
        style={{ backgroundColor: "#0c88fb", color: "white", marginLeft: 2 }}
      >
        Try Again
      </button>
    </div>
  );

  function handleClick(element) {
    setIsClicked(true);
    textColor(element);

    if (element === loadedQuestions[currentQuestion].correct_answer) {
      setScore(score + 100 / loadedQuestions.length);
    }
  }

  function textColor(element) {
    let classN = "bg ";
    //must check if element is in the correct_answer array
    element === loadedQuestions[currentQuestion].correct_answer
      ? (classN += "bg-info")
      : (classN += "bg-secondary");

    return classN;
  }

  function nextQuestionFunction() {
    if (currentQuestion + 1 === loadedQuestions.length) {
      setFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setIsClicked(false);
    }
  }

  function textDisplay() {
    if (finished) {
      return afterFinish;
    } else {
      return beforeFinish;
    }
  }

  function tryAgain() {
    setCurrentQuestion(0);
    setScore(0);
    setIsClicked(false);
    setFinished(false);
  }

  return textDisplay();
}

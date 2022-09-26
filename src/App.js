import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";

export default function App() {
  //the array of loadedQuestions that was is fetched from API
  const [loadedQuestions, setLoadedQuestions] = React.useState([0]);
  let results = [];

  async function fetchData() {
    /*
    await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoadedQuestions(data.results);
        results = data.results;

        // setFormattedQuestion(data.question);
        // console.log("WWW" + formattedQuestion);

        // const questions = data.results.map((loadedQuestion) => {
        //   setFormattedQuestion ( {
        //       question: loadedQuestion.question,
        //   });
      });
      */
    //Async await syntax usage only
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    const { results } = data;
    return results;
  }

  useEffect(async () => {
    //Here we call fetch data but is an asynchronous method. We need to wait her to get results, and use them to render to the dom.
    // But we cannot use await without a wrapped async function. Whenever we see an await keyword, is always going together with an
    //async keyword
    const results = await fetchData();
    //We follow up with using the data here! Setting them, (setLoadedQuestions), and the rest of the rendering logic...
  }, []);

  const [isClicked, setIsClicked] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  console.log(results);
  setTimeout(() => {
    console.log(results);
  }, 2000);

  // console.log(Object.values(loadedQuestions));
  // for (const key of Object.keys(loadedQuestions)) {
  //   console.log(loadedQuestions[key]);
  //   setFinalQuestions(loadedQuestions[key]);
  //   console.log("key:" + key);
  // }
  // console.log(Object.values(loadedQuestions));
  // na emfanizei oles tis pithanes apantiseis, na tis sygkentrwsw se ena pinaka kai na apeikonizontai me random seira
  const answers = results[currentQuestion].map(
    //
    (element) => (
      <li>
        <span
          onClick={() => handleClick(element)}
          style={{ cursor: "pointer" }}
          className={isClicked ? textColor(element) : "bg"}
        >
          {/* {console.log(element)} */}
          {/* {element.incorrect_answers.foreach(e)=> <li>e</li>} */}
          {element.incorrect_answers}
        </span>
      </li>
    )
  );

  const beforeFinish = (
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
    if (element.isCorrect && !isClicked) {
      setScore(score + 100 / loadedQuestions.length);
    }
  }

  function textColor(element) {
    let classN = "bg ";
    element.isCorrect ? (classN += "bg-info") : (classN += "bg-secondary");

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

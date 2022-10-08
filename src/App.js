import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  //the array of loadedQuestions that was is fetched from API
  let [loadedQuestions, setLoadedQuestions] = React.useState([]);
  let [rawQuestions, setRawQuestions] = React.useState([]);
  let [isFetching, setIsFetching] = React.useState(true);
  let [fetchingCategories, setFetchingCategories] = React.useState(true);
  let categoryChose = false;
  let [categories, setCategories] = React.useState([]);

  async function fetchCategories() {
    const response = await axios.get("https://opentdb.com/api_category.php");
    const data = await response.data;
    categories = data.trivia_categories;
    setCategories(categories);
    fetchingCategories = false;
    setFetchingCategories(false);
    console.log(categories);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const [isClicked, setIsClicked] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  let answers = [];
  let beforeFinish = null;

  async function fetchData(categoryId) {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`
    );
    const data = await response.data;
    rawQuestions = data.results;

    //adding the correct answer to incorrect_answers array
    for (let obj of rawQuestions)
      obj.incorrect_answers.splice(
        Math.floor(Math.random() * 4),
        0,
        obj.correct_answer
      );

    //replace every &quot; with " and every &#039; with '
    for (let obj of rawQuestions) {
      //here adjust the question text
      obj.question = obj.question.replaceAll("&quot;", '"');
      obj.question = obj.question.replaceAll("&#039;", "'");
      obj.question = obj.question.replaceAll("&rsquo;", "'");

      //adjust the correct answer because it must be the same when it is checked in conditional statement below
      obj.correct_answer = obj.correct_answer.replaceAll("&quot;", '"');
      obj.correct_answer = obj.correct_answer.replaceAll("&#039;", "'");
      obj.correct_answer = obj.correct_answer.replaceAll("&rsquo;", "'");

      for (let x = 0; x < obj.incorrect_answers.length; x++) {
        obj.incorrect_answers[x] = obj.incorrect_answers[x].replaceAll(
          "&quot;",
          '"'
        );
        obj.incorrect_answers[x] = obj.incorrect_answers[x].replaceAll(
          "&#039;",
          "'"
        );
        obj.incorrect_answers[x] = obj.incorrect_answers[x].replaceAll(
          "&rsquo;",
          "'"
        );
      }
    }
    loadedQuestions = rawQuestions;
    setLoadedQuestions(loadedQuestions);
    console.log(loadedQuestions);

    setIsFetching(false);
    isFetching = false;
  }

  //choose category first
  if (!categoryChose) {
    if (!fetchingCategories) {
      const categoryNames = categories.map(({ id, name }) => (
        <option value={id}>{name}</option>
      ));
      beforeFinish = (
        <div className="beforeFinish-container">
          <h1>Welcome to Michael's Ouroumis quiz!</h1>
          <p>
            Based on{" "}
            <span style={{ textDecoration: "underline" }}>
              Open Trivia Database!
            </span>
          </p>
          <label style={{ color: "#0c88fb" }}>
            <h4>Choose category to test your knowledge!</h4> <br />
            {/* handleClickCategoryChoose leads to fetchData() based on the category of the value */}
            <select onChange={handleClickCategoryChoose}>
              {categoryNames}
            </select>
          </label>
        </div>
      );
    }
  }

  if (!isFetching) {
    answers = loadedQuestions[currentQuestion].incorrect_answers.map(
      (element) => (
        <li>
          <span
            key={currentQuestion.toString()}
            onClick={() => handleClick(element)}
            style={{ cursor: "pointer" }}
            className={isClicked ? textColor(element) : "bg"}
          >
            {element}
          </span>
        </li>
      )
    );
    beforeFinish = (
      <div className="beforeFinish-container">
        <h5 className="m-3" style={{ textDecoration: "underline" }}>
          {loadedQuestions[currentQuestion].question}
        </h5>
        <ol style={{ listStyleType: "lower-latin", marginLeft: "-25px" }}>
          {answers}
        </ol>
        <button
          onClick={() => nextQuestionFunction()}
          style={{
            backgroundColor: "#0c88fb",
            color: "white",
            marginLeft: 10,
          }}
        >
          Next Question
        </button>
        <h5 style={{ marginTop: 15, marginLeft: 10 }}>
          Your score is{" "}
          <span style={{ color: "#0c88fb", fontWeight: "bold" }}>{score}</span>!
        </h5>
      </div>
    );
  }
  const afterFinish = (
    <div className="afterFinish-container">
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
  function handleClickCategoryChoose(event) {
    const id = event.target.value;
    fetchData(id);
  }

  function handleClick(element) {
    setIsClicked(true);
    textColor(element);

    if (element === loadedQuestions[currentQuestion].correct_answer) {
      setScore(score + 100 / loadedQuestions.length);
    }
  }

  function textColor(element) {
    let classN = "bg ";
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
    setIsFetching(true);
  }

  return textDisplay();
}

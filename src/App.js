/*******BIG TASKS*********
 * USERNAME
 * LOCALSTORAGE
 *
 * ****SMALL TASKS*****
 * COMPONENTS
 * STYLING
 */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { RingLoader } from "react-spinners";

export default function App() {
  //the array of questions that was is fetched from API
  let [questions, setQuestions] = React.useState([]);
  let [rawQuestions, setRawQuestions] = React.useState([]);
  let [isFetching, setIsFetching] = React.useState(true);
  let [fetchingCategories, setFetchingCategories] = React.useState(true);
  let [categories, setCategories] = React.useState([]);
  const [isClicked, setIsClicked] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  let answers = [];
  let beforeFinish = null;

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get("https://opentdb.com/api_category.php");

      const data = await response.data;
      categories = data.trivia_categories;
      setCategories(categories);
      fetchingCategories = false;
      setFetchingCategories(false);
    } catch (err) {
      alert(err);
    }
  }

  async function fetchQuestions(categoryId) {
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`
      );
      console.log(response);
      const code = response.data.response_code;

      //manual error if promise is rejected..
      if (code !== 0) {
        const err =
          code === 1
            ? " No Results. The API doesn't have enough questions for your query."
            : code === 2
            ? "Invalid Parameter. Arguements passed in aren't valid."
            : code === 3
            ? "Token Not Found. Session Token does not exist."
            : "Token Empty Session. Token has returned all possible questions for the specified query. Resetting the Token is necessary.";
        // :code =3?4)
        throw new Error(`${err}`);
      } else {
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
        questions = rawQuestions;
        setQuestions(questions);
        console.log(questions);

        setIsFetching(false);
        isFetching = false;
        return questions;
      }
    } catch (err) {
      alert(err);
    }
  }

  //choose category first
  if (!fetchingCategories) {
    const categoryNames = categories.map(({ id, name }) => (
      <option value={id}>{name}</option>
    ));

    beforeFinish = (
      <div className="beforeFinish-container">
        <h1>Welcome to Michael's Ouroumis quiz game!</h1>
        <p>
          Based on{" "}
          <span style={{ textDecoration: "underline" }}>
            Open Trivia Database!
          </span>
        </p>
        <label style={{ color: "#0c88fb" }}>
          <h4>Choose category to test your knowledge!</h4> <br />
          {/* handleClickCategoryChoose leads to fetchData() based on the category of the value */}
          <select onChange={handleClickCategoryChoose}>{categoryNames}</select>
        </label>
      </div>
    );
  } else
    beforeFinish = (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <RingLoader color="#36d7b7" size={150} />
      </div>
    );

  if (!isFetching) {
    answers = questions[currentQuestion].incorrect_answers.map((element) => (
      <li>
        <span
          key={currentQuestion.toString()}
          onClick={() => handleClick(element)}
          style={{
            cursor: "pointer",
            padding: "10px",
            margin: "20px",
            borderRadius: "10px",
          }}
          className={isClicked ? textColor(element) : "bg-dark"}
        >
          {element}
        </span>
      </li>
    ));

    beforeFinish = (
      <div className="beforeFinish-container">
        <h5 className="m-3" style={{ textDecoration: "underline" }}>
          {questions[currentQuestion].question}
        </h5>
        <ol style={{ listStyleType: "none", marginLeft: "-20px" }}>
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
    fetchQuestions(id);
  }

  function handleClick(element) {
    setIsClicked(true);
    textColor(element);

    if (element === questions[currentQuestion].correct_answer) {
      setScore(score + 100 / questions.length);
    }
  }

  function textColor(element) {
    let classN = "bg ";
    element === questions[currentQuestion].correct_answer
      ? (classN += "bg-success")
      : (classN += "bg-dark");

    return classN;
  }

  function nextQuestionFunction() {
    if (currentQuestion + 1 === questions.length) {
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

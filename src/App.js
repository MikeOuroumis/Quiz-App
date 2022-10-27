/*******BIG TASKS*********
 * USERNAME
 * LOCALSTORAGE
 *
 * ****SMALL TASKS*****
 * STYLING
 */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { RingLoader } from "react-spinners";
import Answer from "./components/Answer";
import StartingScreen from "./components/StartingScreen";
import QuizScreen from "./components/QuizScreen";
import FinishScreen from "./components/FinishScreen";
import RegisterScreen from "./components/RegisterScreen";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  //the array of results that was is fetched from API
  let [results, setResults] = useState([]);
  let [isFetching, setIsFetching] = useState(true);
  let [fetchingCategories, setFetchingCategories] = useState(true);
  let [categories, setCategories] = useState([]);
  let [currentUser, setCurrentUser] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questionId, setQuestionId] = useState("");
  let answers = [];
  let screen = null;

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get("https://opentdb.com/api_category.php");

      const data = await response.data;
      categories = data.trivia_categories;
      setCategories(categories);
      setFetchingCategories(false);
    } catch (err) {
      alert(err);
    }
  }

  async function fetchresults(categoryId) {
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

        throw new Error(`${err}`);
      } else {
        const data = await response.data;
        results = data.results;

        //adding the correct answer to incorrect_answers array
        for (let result of results)
          result.incorrect_answers.splice(
            Math.floor(Math.random() * 4),
            0,
            result.correct_answer
          );

        setResults(results);
        console.log(results);

        setIsFetching(false);
        return results;
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

    screen = (
      <StartingScreen
        onChange={handleChange}
        onSubmit={handleSubmit}
        content={categoryNames}
      />
    );
  } else
    screen = (
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
    answers = results[currentQuestion].incorrect_answers.map((element) => (
      <li>
        <Answer
          text={element}
          onClick={() => handleClick(element)}
          className={isClicked ? textColor(element) : "bg-dark"}
        />
      </li>
    ));

    screen = (
      <QuizScreen
        title={results[currentQuestion].question}
        answers={answers}
        onClick={nextQuestionFunction}
        score={score}
      />
    );
  }
  if (finished) screen = <FinishScreen score={score} onClick={tryAgain} />;

  function handleChange(event) {
    setQuestionId(event.target.value);
  }

  function handleSubmit(event) {
    fetchresults(questionId);
    event.preventDefault();
  }

  function handleClick(element) {
    setIsClicked(true);
    textColor(element);

    if (element === results[currentQuestion].correct_answer) {
      setScore(score + 100 / results.length);
    }
  }

  function textColor(element) {
    let classN = "bg ";
    element === results[currentQuestion].correct_answer
      ? (classN += "bg-success")
      : (classN += "bg-dark");

    return classN;
  }

  function nextQuestionFunction() {
    if (currentQuestion + 1 === results.length) {
      setFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setIsClicked(false);
    }
  }

  function tryAgain() {
    setCurrentQuestion(0);
    setScore(0);
    setIsClicked(false);
    setFinished(false);
    setIsFetching(true);
  }

  return <LoginScreen />;
}

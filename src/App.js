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
import Answer from "./components/Answer";
import StartingScreen from "./components/StartingScreen";
import QuizScreen from "./components/QuizScreen";
import FinishScreen from "./components/FinishScreen";

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
  const [questionId, setQuestionId] = React.useState("");
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
    answers = questions[currentQuestion].incorrect_answers.map((element) => (
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
        title={questions[currentQuestion].question}
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
    fetchQuestions(questionId);
    event.preventDefault();
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

  function tryAgain() {
    setCurrentQuestion(0);
    setScore(0);
    setIsClicked(false);
    setFinished(false);
    setIsFetching(true);
  }

  return screen;
}

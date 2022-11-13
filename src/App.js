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
  let [usersArray, setUsersArray] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  let [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questionId, setQuestionId] = useState("");
  let [user, setUser] = React.useState(null);
  const [registerScreen, setRegisterScreen] = useState(false);
  let answers = [];
  let screen = null;
  let [userIndex, setUserIndex] = useState(null);

  useEffect(() => {
    fetchCategories();

    const data = localStorage.getItem("usersArray");
    data && setUsersArray(JSON.parse(data));
    if (data) usersArray = JSON.parse(data);
  }, []);

  useEffect(() => {
    //stores the user only if the form is valid
    localStorage.setItem("usersArray", JSON.stringify(usersArray));
  }, [score]);

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
        // creating the all_answers array
        for (let result of results) {
          let allAnswers = [...result.incorrect_answers, result.correct_answer];
          // shuffling the answers in the array with Durstenfeld shuffle method
          for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
          }
          //adding allAnswers in the results
          result.all_answers = allAnswers;
        }

        // console.log(results);
        setResults(results);

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
    let objAnswers = [];
    let currentAnswers = results[currentQuestion].all_answers;

    //creating an array of objects to set the clicked property
    for (let answer of currentAnswers) {
      let curObj = {};

      //getting index and set it as key
      const index = currentAnswers.indexOf(answer);
      curObj[index] = answer;

      curObj.clicked = false;
      objAnswers.push(curObj);
      console.log(objAnswers);
    }

    answers = objAnswers.map((object) => (
      <li key={Object.keys(object)} style={{ margin: "8px 15px 8px 0" }}>
        <Answer
          text={Object.values(object)}
          onClick={() => handleClick(Object.keys(object))}
          className={testClassName(object)}
        />
      </li>
    ));

    function testClassName(object) {
      console.log(object.clicked);
      return object?.clicked ? "btn btn-danger" : "btn btn-light";
    }

    function handleClick(element) {
      setIsClicked(true);
      // if (element === Object.values(seperateObjects)) console.log("is clicked");
      // const selectedAnswer = Object.values(element)[0]; // textColor(element);
      console.log(element);
      console.log(objAnswers[element][0]);
      // objAnswers[element].clicked = true;
      objAnswers[element].clicked = true;
      // if (
      //   !isClicked &&
      //   Object.values(element)[0] === results[currentQuestion].correct_answer
      // ) {
      //   setScore(score + 100 / results.length);

      //   usersArray[userIndex].totalScore =
      //     usersArray[userIndex].totalScore + 100 / results.length;

      //   //set total score to usersArray and run the useEffect
      //   setUsersArray(usersArray);
      // }
    }
    console.log(objAnswers);

    function textColor(element) {
      let classN = "btn ";
      // console.log(element);
      // console.log(Object.values(element)[0]);
      // if (Object.values(element)[1]) {
      Object.values(element)[0] === results[currentQuestion].correct_answer
        ? (classN += "btn-success")
        : (classN += "btn-light");
      // }

      return classN;
    }

    screen = (
      <QuizScreen
        title={results[currentQuestion].question}
        answers={answers}
        onClick={nextQuestionFunction}
        score={score}
        totalScore={usersArray[userIndex].totalScore}
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
  function getUserIndex(index) {
    //add totalScore property if doesn't exist
    if (!usersArray[index].totalScore) {
      usersArray[index].totalScore = 0;
      setUsersArray(usersArray);
    }
    userIndex = index;
    setUserIndex(index);
    setUsersArray(usersArray);
    setUser(usersArray[index]);
    user = usersArray[index];
  }
  function registerLogilToggle() {
    setRegisterScreen(!registerScreen);
  }
  // return <RegisterScreen />;
  if (!user)
    return registerScreen ? (
      <RegisterScreen registerLogilToggle={registerLogilToggle} />
    ) : (
      <LoginScreen
        registerLogilToggle={registerLogilToggle}
        setUserIndex={getUserIndex}
      />
    );
  else return screen;
}

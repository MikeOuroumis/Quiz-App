import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";

export default function App () {
  
  const questions = [
      {
        theQuestion: "What's the maximum temperature in Celsius for the water to freeze?",
        theAnswer: [
            {answerText: "10", isCorrect : false},
            {answerText: "30", isCorrect : false},
            {answerText: "-10", isCorrect : false},
            {answerText: "0", isCorrect : true},
        ],
      },

      {
        theQuestion: "Which is the 1st index number in reactjs list?",
        theAnswer: [
            {answerText: "0", isCorrect : true},
            {answerText: "1", isCorrect : false},
            {answerText: "-1", isCorrect : false},
            {answerText: "10", isCorrect : false},
        ],
      },

      {
        theQuestion: "How many bits is a Giga Byte?",
        theAnswer: [
            {answerText: "1024000000", isCorrect : false},
            {answerText: "4554156452", isCorrect : false},
            {answerText: "9877412314", isCorrect : false},
            {answerText: "8589934592", isCorrect : true},
        ],
      },

      {
        theQuestion: "What is the symbol of 'power to' in Python?",
        theAnswer: [
            {answerText: "^", isCorrect : false},
            {answerText: "%", isCorrect : false},
            {answerText: "*", isCorrect : false},
            {answerText: "**", isCorrect : true},
        ],
      },
  ];  

  const [isClicked, setIsClicked] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  
  const answers = questions[currentQuestion].theAnswer.map(element => 
    <li>
      <span 
        onClick={() => handleClick(element)} 
        style = {{cursor : 'pointer'}}
        className={isClicked ? textColor(element) : "bg"}
      >
        {element.answerText}
      </span>
    </li>);
  
  const beforeFinish =
  (<div>
    <h5 
    className='m-3'
    style = {{textDecoration: 'underline'}}
    >{questions[currentQuestion].theQuestion}</h5>
    <ol style={{listStyleType : 'lower-latin'}}>{answers}</ol>
    <button 
      onClick={() => nextQuestionFunction()}
      style = {{backgroundColor: '#0c88fb', color: 'white', marginLeft: 10}}
      >
        Next Question
      </button>
    <h5 style = {{marginTop: 15, marginLeft: 10}}>Your score is <span style={{color: '#0c88fb', fontWeight: 'bold'}}>{score}</span>!</h5>
  </div>);

  const afterFinish = 
  (<div>
    <h1>Finished!</h1>
    <h5>Your Score is <span style={{color: '#0c88fb', fontWeight: 'bold'}}>{score}</span></h5>
    <button 
    onClick={()=> tryAgain()}
    style = {{backgroundColor: '#0c88fb', color: 'white', marginLeft: 2}}
    >
      Try Again
    </button>
  </div>);
  
  function handleClick (element) {
    setIsClicked(true);
    textColor(element);
    if (element.isCorrect && !isClicked) {
      setScore(score + 100/questions.length);
    }
  }

  function textColor (element) {
    let classN = "bg ";
      element.isCorrect ? classN += "bg-info" : classN += "bg-secondary";
    
    return classN;
  }

  function nextQuestionFunction () {
    if ((currentQuestion + 1) === questions.length){
      setFinished(true);
    }
    else{
      setCurrentQuestion(currentQuestion+1);
      setIsClicked(false);
    }
  }
  
  function textDisplay(){
    if (finished){
      return afterFinish;
    }
    else{
      return beforeFinish;
    }
}

function tryAgain(){
  setCurrentQuestion(0);
  setScore(0);
  setIsClicked(false);
  setFinished(false);
}

  return ( 
    textDisplay()
  );
}
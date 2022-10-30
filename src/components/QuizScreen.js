import React from "react";
import Button from "./Button";
import { EncodeMode, decode } from "html-entities";

export default function QuizScreen(props) {
  return (
    <div className="quiz-container">
      <h5
        className="my-5"
        style={{
          fontSize: "25px",
        }}
      >
        {decode(props.title)}
      </h5>
      <ol style={{ listStyleType: "none", marginLeft: "-20px" }}>
        <p>{props.answers}</p>
      </ol>
      <Button
        style={{ margin: "15px 0" }}
        onClick={props.onClick}
        text="Next Question"
      />

      <h5 style={{ marginTop: 15, marginLeft: 10 }}>
        Your score is{" "}
        <span style={{ color: "#0c88fb", fontWeight: "bold" }}>
          {props.score}
        </span>
        !
      </h5>
      <h5>
        <span style={{ color: "red" }}>TOTAL SCORE: </span>
        {props.totalScore}
      </h5>
    </div>
  );
}

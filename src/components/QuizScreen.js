import React from "react";
import Button from "./Button";
import { EncodeMode, decode } from "html-entities";

export default function QuizScreen(props) {
  return (
    <div className="quiz-container">
      <p
        className="my-5"
        style={{
          fontSize: "22px",
        }}
      >
        {decode(props.title)}
      </p>
      <hr />

      <ol style={{ listStyleType: "none", marginLeft: "-20px" }}>
        <p>{props.answers}</p>
      </ol>
      <hr />
      <Button
        style={{ margin: "15px 0" }}
        onClick={props.onClick}
        text="Next Question"
      />

      <p style={{ marginTop: 15, marginLeft: 10 }}>
        Your score is{" "}
        <span style={{ color: "#0c88fb", fontWeight: "bold" }}>
          {props.score}
        </span>
        !
      </p>
      <h5>
        <span style={{ color: "red" }}>TOTAL SCORE: </span>
        {props.totalScore}
      </h5>
    </div>
  );
}

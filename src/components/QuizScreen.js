import React from "react";
import Button from "./Button";

export default function QuizScreen(props) {
  return (
    <div className="quiz-container">
      <h5 className="m-3" style={{ textDecoration: "underline" }}>
        {props.title}
      </h5>
      <ol style={{ listStyleType: "none", marginLeft: "-20px" }}>
        {props.answers}
      </ol>
      <Button onClick={props.onClick} text="Next Question" />

      <h5 style={{ marginTop: 15, marginLeft: 10 }}>
        Your score is{" "}
        <span style={{ color: "#0c88fb", fontWeight: "bold" }}>
          {props.score}
        </span>
        !
      </h5>
    </div>
  );
}

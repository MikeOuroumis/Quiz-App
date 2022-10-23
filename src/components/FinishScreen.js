import React from "react";
import Button from "./Button";

export default function FinishScreen(props) {
  return (
    <div className="quiz-container">
      <h1>Finished!</h1>
      <h5>
        Your Score is{" "}
        <span style={{ color: "#0c88fb", fontWeight: "bold" }}>
          {props.score}
        </span>
      </h5>
      <Button onClick={props.onClick} text="Try Again" />
    </div>
  );
}

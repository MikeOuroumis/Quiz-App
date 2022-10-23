import React from "react";
import Button from "./Button";

export default function StartingScreen(props) {
  return (
    <div className="quiz-container">
      <h1>Welcome to Michael's Ouroumis quiz game!</h1>
      <p>
        Based on{" "}
        <span style={{ textDecoration: "underline" }}>
          Open Trivia Database!
        </span>
      </p>
      <label style={{ color: "#0c88fb" }}>
        <h4>Choose category to test your knowledge!</h4> <br />
        <form onSubmit={props.onSubmit}>
          <select onChange={props.onChange}>{props.content}</select>
          <Button type="submit" text="Start" />
        </form>
      </label>
    </div>
  );
}

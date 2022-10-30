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
        <form
          className="form-inline d-inline-flex p-2"
          onSubmit={props.onSubmit}
        >
          <select style={{ height: "35px" }} onChange={props.onChange}>
            {props.content}
          </select>
          <Button
            style={{ marginTop: "-1px", height: "36px" }}
            type="submit"
            text="Start"
          />
        </form>
      </label>
    </div>
  );
}

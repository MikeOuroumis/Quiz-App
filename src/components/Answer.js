import React, { useState } from "react";

export default function Answer(props) {
  return (
    <button
      onClick={props.onClick}
      style={{ width: "500px", height: "50px" }}
      className={props.className}
    >
      {props.text}
    </button>
  );
}

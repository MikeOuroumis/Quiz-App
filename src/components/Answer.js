import React, { useState } from "react";

export default function Answer(props) {
  return (
    <button
      onClick={props.onClick}
      style={{ width: "-webkit-fill-available", height: "50px" }}
      className={props.className}
    >
      {props.text}
    </button>
  );
}

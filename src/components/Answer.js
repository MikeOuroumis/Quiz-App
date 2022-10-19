import React, { useState } from "react";
import { useEffect } from "react";

export default function Answer(props) {
  return (
    <span
      onClick={props.onClick}
      style={{
        cursor: "pointer",
        padding: "10px",
        margin: "20px",
        borderRadius: "10px",
      }}
      className={props.className}
    >
      {props.text}
    </span>
  );
}

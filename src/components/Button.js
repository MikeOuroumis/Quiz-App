import React, { useState } from "react";

export default function Button(props) {
  return (
    <button
      onClick={props.onClick}
      style={{
        backgroundColor: "#0c88fb",
        color: "white",
        marginLeft: 10,
      }}
    >
      {props.text}{" "}
    </button>
  );
}

import React, { useState } from "react";

export default function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className="btn btn-primary"
      style={props.style}
    >
      <span>{props.text}</span>
    </button>
  );
}

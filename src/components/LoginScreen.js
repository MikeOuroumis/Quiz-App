import React from "react";
import Button from "./Button";

export default function LoginScreen() {
  const [user, setUser] = React.useState({
    username: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = React.useState({});

  function handleChange(event) {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("submitted");
    setErrorMessages(validation());
  }

  function validation() {
    const errors = {};
    if (user.username.trim() === "")
      errors.username = "Please fill in the username";
    if (user.password.trim() === "")
      errors.password = "Please fill in the password";
    return errors;
  }

  return (
    <div className="quiz-container">
      <form onSubmit={handleSubmit}>
        <label style={{ color: "white" }}>Username</label>
        <br />
        <input
          id="username"
          placeholder="username"
          onChange={handleChange}
          name="username"
          value={user.username}
        ></input>
        {errorMessages.username && <div>{errorMessages.username}</div>}
        <br />
        <label style={{ color: "white" }}>Password</label>
        <br />
        <input
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
          name="password"
          value={user.password}
        ></input>
        <br />
        {errorMessages.password && <div>{errorMessages.password}</div>} <br />
        <Button type="submit" text="Submit" />
      </form>
    </div>
  );
}

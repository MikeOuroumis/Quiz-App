import React from "react";
import Button from "./Button";
import { useEffect, useState } from "react";

export default function RegisterScreen() {
  let [isValid, setIsValid] = React.useState(false);

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    name: "",
  });

  const [usersArray, setUsersArray] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    name: null,
    email: null,
    password: null,
  });

  let [userIsNew, setUserIsNew] = useState(true);

  useEffect(() => {
    //logic for getting a value from local storage stored under the key 'key'
    const data = localStorage.getItem("usersArray");
    //if data is null don't run the next line...
    data && setUsersArray(JSON.parse(data));
  }, []);

  useEffect(() => {
    //stores the user only if the form is valid
    isValid && localStorage.setItem("usersArray", JSON.stringify(usersArray));
  }, [usersArray]);

  function handleChange(event) {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessages(validation());
    //no errors? store name, email, password to the database
    console.log(`is valid: ${isValid}`);

    for (const item of usersArray) {
      if (user.email === item.email) {
        setUserIsNew(false);
        userIsNew = false;
      } else {
        setUserIsNew(true);
        userIsNew = true;
      }
    }
    console.log(userIsNew);
    if (isValid && userIsNew)
      setUsersArray((prevArray) => [...prevArray, user]);
  }

  function validation() {
    const errors = {};
    if (user.email.trim() === "") errors.email = "Please fill in the email";
    else errors.email = null;
    if (user.password.trim() === "")
      errors.password = "Please fill in the password";
    else errors.password = null;
    if (user.name.trim() === "") errors.name = "Please fill in the name";
    else errors.name = null;

    errors.name === null && errors.email === null && errors.password === null
      ? (isValid = true)
      : (isValid = false);
    setIsValid(isValid);

    return errors;
  }

  return (
    <div className="quiz-container">
      <form onSubmit={handleSubmit}>
        <label style={{ color: "white" }}>Name</label>
        <br />
        <input
          id="name"
          placeholder="name"
          onChange={handleChange}
          name="name"
          value={user.name}
        ></input>
        {errorMessages.name && <div>{errorMessages.name}</div>}
        <br />
        <label style={{ color: "white" }}>email</label>
        <br />
        <input
          id="email"
          type="email"
          placeholder="email"
          onChange={handleChange}
          name="email"
          value={user.email}
        ></input>
        {errorMessages.email && <div>{errorMessages.email}</div>}
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
      <p>{!userIsNew && "The user already exists"} </p>
    </div>
  );
}

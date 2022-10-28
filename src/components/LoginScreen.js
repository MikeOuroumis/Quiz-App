import React, { useState, useEffect } from "react";
import Button from "./Button";

export default function LoginScreen(props) {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [errorMessages, setErrorMessages] = React.useState({});
  let [usersArray, setUsersArray] = useState([]);
  let [userExists, setUserExists] = useState(false);
  let userIndex = null;
  let curUserEmail;
  let curUserPassword;

  useEffect(() => {
    //logic for getting a value from local storage stored under the key 'key'
    const data = localStorage.getItem("usersArray");
    //if data is null don't run the next line...
    data && setUsersArray(JSON.parse(data));
    if (data) usersArray = JSON.parse(data);
  }, []);

  function handleChange(event) {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessages(validation());

    //Does user exist?
    for (const item of usersArray) {
      if (user.email === item.email) {
        setUserExists(true);
        userExists = true;
        //index to match the email and password later...
        console.log(`item: ${usersArray.indexOf(item)}`);
        userIndex = usersArray.indexOf(item);
        console.log(usersArray[userIndex].email);

        break;
      } else {
        setUserExists(false);
        userExists = false;
      }
    }
    curUserEmail = usersArray[userIndex].email;
    curUserPassword = usersArray[userIndex].password;

    //if the password is correct then login...
    if (curUserPassword === event.target.password.value) {
      console.log("logged in");
      //here must follow the login code...
      //pass user data to App.js
      //pass userIndex to App.js
      const currentUser = usersArray[userIndex];
      //how to pass currentUser to App.js
      //sends the user index to App.js
      props.setUserIndex(userIndex);
      return currentUser;
    }

    if (userExists) console.log("user exists");
    else console.log("user doesn't exist");
  }

  function validation() {
    const errors = {};
    if (user.email.trim() === "") errors.email = "Please fill in the email";
    if (user.password.trim() === "")
      errors.password = "Please fill in the password";
    return errors;
  }

  return (
    <div className="quiz-container">
      <h1 style={{ color: "#0c88fb" }}>Login</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label style={{ color: "white" }}>email</label>
        <br />
        <input
          id="email"
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
        <br />
        <Button type="submit" text="Submit" />
      </form>
    </div>
  );
}

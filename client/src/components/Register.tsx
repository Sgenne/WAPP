import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const usernameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(event.target.value);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const dateOfBirthChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBirthDate(event.target.value);
  };

  const submitClickHandler = async () => {
    if (!(username && password && email && birthDate)) return;

    await axios.post("http://localhost:8080/user/register", {
      username: username,
      password: password,
      email: email,
      birthDate: birthDate,
    });
  };

  return (
    <div className="register">
      <label>Username: </label>
      <input
        type="text"
        name="username"
        className="register__username-input"
        placeholder="Enter a username"
        onChange={usernameChangeHandler}
      />
      <label>password: </label>

      <input
        name="password"
        type="password"
        className="register__password-input"
        placeholder="Enter a password"
        onChange={passwordChangeHandler}
      />
      <label>Email: </label>

      <input
        type="email"
        className="register__email-input"
        placeholder="Enter your email"
        onChange={emailChangeHandler}
      />
      <label>date of birth: </label>

      <input
        type="date"
        className="register__birth-date-input"
        onChange={dateOfBirthChangeHandler}
      />

      <button onClick={submitClickHandler}>Register</button>
      <button>Cancel</button>
    </div>
  );
};

export default Register;

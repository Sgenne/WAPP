import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

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

  const birthDateChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBirthDate(event.target.value);
  };

  const validInput = username && password && email && birthDate;

  const submitClickHandler = async () => {
    if (!validInput) return;

    await axios.post("http://localhost:8080/user/register", {
      username: username,
      password: password,
      email: email,
      birthDate: birthDate,
    });
  };

  return (
    <Modal>
      <div className="register">
        <div className="register__input-container">
          <label>Username: </label>
          <input
            type="text"
            name="username"
            className="register__username-input"
            placeholder="Enter a username"
            onChange={usernameChangeHandler}
          />
        </div>
        <div className="register__input-container">
          <label>password: </label>
          <input
            name="password"
            type="password"
            className="register__password-input"
            placeholder="Enter a password"
            onChange={passwordChangeHandler}
          />
        </div>
        <div className="register__input-container">
          <label>Email: </label>
          <input
            name="email"
            type="email"
            className="register__email-input"
            placeholder="Enter your email"
            onChange={emailChangeHandler}
          />
        </div>

        <div className="register__input-container">
          <label>Date of birth: </label>
          <input
            name="date of birth"
            type="date"
            className="register__birth-date-input"
            onChange={birthDateChangeHandler}
          />
        </div>

        <div className="register__buttons">
          <button onClick={submitClickHandler} disabled={!validInput}>
            Register
          </button>
          <button>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default Register;

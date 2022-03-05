import { useState, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import Modal from "../common/Modal";
import { AuthContext } from "../../context/AuthContext";
import ErrorMessage from "../common/ErrorMessage";

const Register = (): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);

  const closeHandler = (): void => {
    authContext.setShowRegister(false);
  };

  const usernameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(event.target.value);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const emailChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
  };

  const birthDateChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBirthDate(event.target.value);
  };

  const validInput = username && password && email && birthDate;

  const submitClickHandler = async (): Promise<void> => {
    if (!validInput) return;
    let result: AxiosResponse;
    try {
      result = await axios.post("http://localhost:8080/user/register", {
        username: username,
        password: password,
        email: email,
        birthDate: birthDate,
      });
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong while signing in.");
        return;
      }

      setErrorMessage(error.response.data.message);
      return;
    }

    const signedInUser = result.data.user;

    authContext.setIsSignedIn(true);
    authContext.setSignedInUser(signedInUser);
    authContext.setPassword(password);
    authContext.setShowRegister(false);
  };

  return (
    <Modal onBackgroundClick={closeHandler}>
      <div className="register">
        <div className="register__error-message">
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
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
          <label>Password: </label>
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
          <button onClick={closeHandler}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default Register;

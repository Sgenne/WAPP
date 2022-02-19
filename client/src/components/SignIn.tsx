import axios, { AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import { User } from "../../../server/src/model/user.interface";
import ErrorMessage from "./ErrorMessage";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);

  const closeHandler = () => {
    authContext.setShowSignIn(false);
  };

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

  const submitClickHandler = async () => {
    let signInResult: AxiosResponse;
    try {
      signInResult = await axios.post<{ message: string; user?: User }>(
        "http://localhost:8080/user/sign-in",
        {
          username: username,
          password: password,
        }
      );
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong while signing in.");
        return;
      }

      setErrorMessage(error.response.data.message);
      return;
    }

    const signedInUser: User = signInResult.data.user;
    authContext.setIsSignedIn(true);
    authContext.setUserId(signedInUser.userId.toString());
    authContext.setUsername(username);
    authContext.setPassword(password);
    authContext.setShowSignIn(false);
  };

  const validInput = username && password;

  return (
    <Modal onBackgroundClick={closeHandler}>
      <div className="sign-in">
        <div className="sign-in__error-message">
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
        <div className="sign-in__input-container">
          <label>Username: </label>
          <input
            type="text"
            name="username"
            className="sign-in__username-input"
            placeholder="Enter a username"
            onChange={usernameChangeHandler}
          />
        </div>
        <div className="sign-in__input-container">
          <label>password: </label>
          <input
            name="password"
            type="password"
            className="sign-in__password-input"
            placeholder="Enter a password"
            onChange={passwordChangeHandler}
          />
        </div>
        <div className="sign-in__buttons">
          <button onClick={submitClickHandler} disabled={!validInput}>
            sign in
          </button>
          <button onClick={closeHandler}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default SignIn;

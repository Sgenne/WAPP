import axios, { AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../common/Modal";
import { User } from "../../../../server/src/model/user.interface";
import ErrorMessage from "../common/ErrorMessage";

const SignIn = (): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);

  const closeHandler = (): void => {
    authContext.setShowSignIn(false);
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

  const handleKeyDown = (event: { key: string }): void => {
    if (event.key === "Enter") {
      submitClickHandler();
    }
  };

  const submitClickHandler = async (): Promise<void> => {
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

    const signedInUser = signInResult.data.user;
    authContext.setIsSignedIn(true);
    authContext.setSignedInUser(signedInUser);
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
            autoFocus
            type="text"
            name="username"
            className="sign-in__username-input"
            placeholder="Enter a username"
            onChange={usernameChangeHandler}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="sign-in__input-container">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            className="sign-in__password-input"
            placeholder="Enter a password"
            onChange={passwordChangeHandler}
            onKeyDown={handleKeyDown}
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

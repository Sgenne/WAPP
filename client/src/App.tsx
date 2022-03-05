import { useContext } from "react";
import Header from "./UI/Header";
import Register from "./UI/authentication/Register";
import { AuthContext } from "./context/AuthContext";
import Router from "./Router";
import SignIn from "./UI/authentication/SignIn";

const App = () => {
  const authContext = useContext(AuthContext);

  return (
    <div>
      <Header />
      {authContext.showRegister && <Register />}
      {authContext.showSignIn && <SignIn />}
      <Router />
    </div>
  );
};

export default App;

import { useContext } from "react";
import Header from "./components/Header";
import Register from "./components/Register";
import { AuthContext } from "./context/AuthContext";
import Router from "./Router";
import SignIn from "./components/SignIn";

const App = () => {
  const authContext = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div className="app__content">
        {authContext.showRegister && <Register />}
        {authContext.showSignIn && <SignIn />}
        <Router />
      </div>
    </div>
  );
};

export default App;

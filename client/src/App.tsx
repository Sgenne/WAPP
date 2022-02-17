import { useContext } from "react";
import Header from "./components/Header";
import Register from "./components/Register";
import { AuthContext } from "./context/AuthContext";
import Router from "./Router";

const App = () => {
  const authContext = useContext(AuthContext);

  console.log("isSignedIn: ", authContext.isSignedIn);
  console.log("userId: ", authContext.userId);
  console.log("password: ", authContext.password);

  return (
    <div>
      <Header />
      {/* Show Register component if authContext.showRegister is true */}
      {authContext.showRegister && <Register />}
      <Router />
    </div>
  );
};

export default App;

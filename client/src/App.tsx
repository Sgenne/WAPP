import { useContext } from "react";
import Header from "./components/Header";
import Register from "./components/Register";
import ThreadPage from "./components/ThreadPage";
import { AuthContext } from "./context/AuthContext";
import CategoryPage from "./components/CategoryPage";
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
      <CategoryPage />
    </div>
  );
};

export default App;

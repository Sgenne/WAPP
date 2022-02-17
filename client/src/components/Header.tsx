import { GiCapybara } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const authState = useContext(AuthContext);

  const signInClickHandler = () => {
    authState.setShowSignIn(true);
  };

  const registerClickHandler = () => {
    authState.setShowRegister(true);
  };

  return (
    <div className="container-fluid">
      <header className="row">
        <div className="header__logo col-lg-2 col-md-3 col-2">
          <GiCapybara className="header__logo-icon" />
          <h1 className="d-none d-md-inline">WAPP</h1>
        </div>
        <div className="header__search col-lg-8 col-md-6 col-6">
          <input type="text" placeholder="what are you looking for?" />
          <button className="header__search-button">
            <FaSearch />
          </button>
        </div>
        <div className="header__account col-lg-2 col-md-3 col-4 d-sm-flex d-inline">
          <button onClick={signInClickHandler}>Sign-in</button>
          <button onClick={registerClickHandler}>Register</button>
        </div>
      </header>
    </div>
  );
};

export default Header;

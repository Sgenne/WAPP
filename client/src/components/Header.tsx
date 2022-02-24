import { GiCapybara } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Header = () => {
  const authContext = useContext(AuthContext);

  const signInClickHandler = () => {
    authContext.setShowSignIn(true);
  };

  const registerClickHandler = () => {
    authContext.setShowRegister(true);
  };

  return (
    <div className="container-fluid">
      <header className="row">
        <div className="header__logo col-lg-2 col-md-3 col-2">
          <NavLink to="/">
            <GiCapybara className="header__logo-icon" />
            <h1 className="d-none d-md-inline">WAPP</h1>
          </NavLink>
        </div>
        <div className="header__search col-lg-8 col-md-6 col-6">
          <input type="text" placeholder="what are you looking for?" />
          <button className="header__search-button">
            <FaSearch />
          </button>
        </div>
        <div className="header__account col-lg-2 col-md-3 col-4 d-sm-flex d-inline">
          {authContext.isSignedIn ? (
            <span className="header__profile-link">
              <NavLink to={`/profile/${authContext.username}`}>
                Hello, {authContext.username}!
              </NavLink>
            </span>
          ) : (
            <>
              <button onClick={signInClickHandler}>Sign-in</button>
              <button onClick={registerClickHandler}>Register</button>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;

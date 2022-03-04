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

  const signedInUser = authContext.signedInUser;

  return (
    <div className="container-fluid">
      <header className="row">
        <div className="header__logo col-md-3 col-2">
          <NavLink to="/">
            <div className="container-fluid d-flex align-items-center justify-content-center">
              <GiCapybara className="col-md-6 col-12 header__logo-icon" />
              <h1 className=".col-md-6 d-md-inline d-none">WAPP</h1>
            </div>
          </NavLink>
        </div>
        <div className="header__search col-6">
          <input type="text" placeholder="what are you looking for?" />
          <button className="header__search-button">
            <FaSearch />
          </button>
        </div>
        <div className="header__account  col-md-3 col-4">
          {signedInUser ? (
            <NavLink to={`/profile/${signedInUser.username}`}>
              <div className="header__profile-link">
                <img
                  className="header__profile-picture col-sm-12 col-6"
                  src={signedInUser.image.imageUrl}
                  alt="signed in user"
                />
                <span className="d-sm-inline d-none col-6">
                  {signedInUser.username}
                </span>
              </div>
            </NavLink>
          ) : (
            <div className="col-12 d-flex d-sm-block flex-column align-items-center">
              <button
                className="col-sm-5  col-12 mx-sm-1"
                onClick={signInClickHandler}
              >
                Sign-in
              </button>
              <button
                className="col-sm-5 col-12 mx-sm-1"
                onClick={registerClickHandler}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;

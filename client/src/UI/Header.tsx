import { GiCapybara } from "react-icons/gi";
import { FaSearch, FaUser } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import Dropdown from "./common/Dropdown";

const Header = (): JSX.Element => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Shows profile options if profile was clicked. Otherwise hides options.
    const clickHandler = (event: Event) => {
      if (
        profileRef.current &&
        profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileOptions((prevValue) => !prevValue);
      } else {
        setShowProfileOptions(false);
      }
    };
    window.addEventListener("click", clickHandler);
    return () => window.removeEventListener("click", clickHandler);
  });

  const signInClickHandler = (): void => {
    authContext.setShowSignIn(true);
  };

  const registerClickHandler = (): void => {
    authContext.setShowRegister(true);
  };

  const signedInUser = authContext.signedInUser;

  const profilePageClickHandler = () => {
    if (!signedInUser) return;

    navigate(`/profile/${signedInUser.username}`);
  };

  const signOutHandler = () => {
    authContext.setIsSignedIn(false);
    authContext.setSignedInUser(undefined);
    document.location.reload();
  };

  const searchInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSearchInput(event.target.value);
  };

  const searchButtonClickHandler = () => {
    if (!searchInput) return;

    navigate(`/search?query=${searchInput}`);
  };

  const handleKeyDown = (event: { key: string }): void => {
    if (event.key === "Enter") {
      searchButtonClickHandler();
    }
  };

  const profileDropdownOptions = [
    {
      title: "Profile page",
      onClick: profilePageClickHandler,
      icon: <FaUser />,
    },
    {
      title: "Sign out",
      onClick: signOutHandler,
      icon: <GoSignOut />,
    },
  ];

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
          <input
            onChange={searchInputChangeHandler}
            type="text"
            placeholder="what are you looking for?"
          />
          <button
            onClick={searchButtonClickHandler}
            onKeyDown={handleKeyDown}
            className="header__search-button"
          >
            <FaSearch />
          </button>
        </div>
        <div className="header__account  col-md-3 col-4">
          {signedInUser ? (
            <div className="header__profile" ref={profileRef}>
              <img
                className="header__profile-picture col-sm-12 col-6"
                src={signedInUser.profilePicture.imageUrl}
                alt="signed in user"
              />
              <span className="d-sm-inline d-none col-6">
                {signedInUser.username}
              </span>
              <Dropdown
                show={showProfileOptions}
                options={profileDropdownOptions}
              />
            </div>
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

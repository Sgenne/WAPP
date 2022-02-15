import { GiCapybara } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";

const Header = () => {
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
          <button>Sign-in</button>
          <button>Register</button>
        </div>
      </header>
    </div>
  );
};

export default Header;

import { GiCapybara } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <div className="header__logo">
        <GiCapybara className="header__logo-icon" />
        <h1>WAPP</h1>
      </div>
      <div className="header__search">
        <input type="text" placeholder="what are you looking for?" />
        <button className="header__search-button">
          <FaSearch />
        </button>
      </div>
      <div className="header__account">
        <button>Sign-in</button>
        <button>Register</button>
      </div>
    </header>
  );
};

export default Header;

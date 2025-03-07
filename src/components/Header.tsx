import "../styles/header.scss";
import logo from "../assets/images/logo.png";

const Header = () => {

  return (
    <div className="header--content">
        <h1 className="header--title">e-Commerce Gapsi</h1> <img src={logo} alt="Gapsi Logo" />
    </div>
  );
};

export default Header;

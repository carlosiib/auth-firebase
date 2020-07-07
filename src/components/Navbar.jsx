import React from "react";
import {
  Link,
  NavLink,
} from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Auth
        </Link>
      <div>
        <div className="d-flex">
          <NavLink
            to="/"
            exact
            className="btn btn-dark mr-2 "
          >
            Inicio{" "}
          </NavLink>
          <NavLink
            to="/admin"
            className="btn btn-dark mr-2"
          >
            Admin{" "}
          </NavLink>
          <NavLink
            to="/login"
            className="btn btn-dark mr-2"
          >
            Login{" "}
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Navbar
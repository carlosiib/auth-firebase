import React from "react";
import {
  Link,
  NavLink,
  withRouter
} from "react-router-dom";

import { auth } from "../firebase"

const Navbar = (props) => {

  const cerrarSesion = () => {
    auth.signOut().then(() => {
      props.history.push("/login")

    })
  }
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
            Inicio
          </NavLink>
          {
            props.firebaseUser !== null ? (
              <NavLink
                to="/admin"
                className="btn btn-dark mr-2"
              >
                Admin
              </NavLink>
            ) : null
          }

          {
            //firebaseUser !== null -> ya existe un usuario
            props.firebaseUser !== null ? (
              <button className="btn btn-dark"
                onClick={() => cerrarSesion()}>Cerrar Sesión</button>
            ) : (
                <NavLink
                  to="/login"
                  className="btn btn-dark mr-2"
                >
                  Login
                </NavLink>
              )
          }

        </div>
      </div>
    </div>
  );
};
export default withRouter(Navbar)
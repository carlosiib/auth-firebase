import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Reset from "./components/Reset";
import Inicio from "./components/Inicio";

import { auth } from "./firebase"

function App() {

  const [firebaseUser, setFirebaseUser] = useState(false)

  //Cargando usuario de firebase
  useEffect(() => {
    //detectando usuario actual en firebase
    auth.onAuthStateChanged(user => {
      console.log(user)
      if (user) {
        //usuario enviado state
        setFirebaseUser(user)
      } else {
        //carga de usuario correcta, pasa de false a null
        setFirebaseUser(null)
      }
    })
  }, [])

  //null !== false -> true
  return firebaseUser !== false ? (
    <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser} />
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/reset">
            <Reset />
          </Route>
          <Route path="/" exact>
            <Inicio />
          </Route>
        </Switch>
      </div>
    </Router>
  ) : (
      <p>Cargando...</p>
    )
}

export default App;

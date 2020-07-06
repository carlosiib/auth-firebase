import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="container">
        Navbar...
        <Switch>
          <Route path="/" exact>
            Inicio...
          </Route>
          <Route path="/login">Login...</Route>
          <Route path="/admin">Admin...</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

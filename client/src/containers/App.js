import React from "react";
import { withCookies } from "react-cookie";
import "./App.css";
import Upload from "../components/Upload/Upload";
import NavBar from "../components/NavBar/NavBar";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Posts from "../components/Posts/Posts";
import Compte from "../components/Compte/Compte";
import Login from "../components/Authentication/Login/Login";
import NoMatch from "../pages/error/NoMatch";
import "semantic-ui-css/semantic.min.css";
import Register from "../components/Authentication/Register/Register";

// I can just get the token payloads from the APP
// componentDidMount()

// And the cookie essentially from the req.cookies!

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <NavBar cookies={this.props.cookies} />
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Posts cookies={this.props.cookies} />}
            />
            <Route
              exact
              path="/upload"
              render={() => <Upload cookies={this.props.cookies} />}
            />
            <Route
              exact
              path="/users/:id"
              render={({ match }) => (
                <Compte cookies={this.props.cookies} match={match} />
              )}
            />
            <Route
              exact
              path="/login"
              render={() => <Login cookies={this.props.cookies} />}
            />
            <Route
              exact
              path="/register"
              render={() => <Register cookies={this.props.cookies} />}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);

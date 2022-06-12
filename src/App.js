import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { initApp, db, uiConfig } from './firebase';
import 'firebase/compat/auth';

// Components
import SignIn from './components/SignIn';
import Home from './components/Home';

// Styles
import './styles.scss';

// JSON
import candidates from './candidates.json';

function App() {
  initApp();
  const [user, setUser] = useState(null);

  const signinProps = {
    firebase,
    uiConfig,
    setUser,
  };

  const homeProps = {
    db,
    firebase,
    candidates,
    user,
    setUser,
  };

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/">
            <SignIn {...signinProps} />
          </Route>
          <Route exact path="/home">
            <Home {...homeProps} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

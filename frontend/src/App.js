import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import './App.css';

import usePersistentState from './lib/persistentState';
import Login from './pages/login';
import HomePage from './pages/homePage';
import Profile from './pages/profile';
import Signup from './pages/signup';
import FourZeroFour from './pages/fourZeroFour';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import moment from 'moment';
import refreshAuthToken from './lib/refreshAuthToken';

function App() {
  const [{username, authToken, refreshToken, tokenExpiryTime}, setRefreshTokenObject] = usePersistentState("refreshTokenObject", {
    username: "",
    authToken: "",
    refreshToken: "",
    tokenExpiryTime: 999
  })

  const [resendQuery, setResendQuery] = useState(false)

  const expiryTimeObject = moment.unix(tokenExpiryTime).utc()
  // TODO: figure out why difference evalutates to 0 sometimes.
  const difference = moment.duration(expiryTimeObject.unix() - moment.utc().unix(), 'seconds')
  console.log(difference.minutes())

  useEffect(() => {
    const handleRefresh = async () => {
      const data = await refreshAuthToken(
        username, 
        refreshToken, 
      )
      const {token, refresh_token, tokenExpiryTime} = await data;
      setRefreshTokenObject({
        username: username,
        authToken: token,
        refreshToken: refresh_token,
        tokenExpiryTime: tokenExpiryTime,
      })
    }

    if(refreshToken !== "" && difference.minutes() < 5 && difference.minutes() !== 0) {
      handleRefresh();
    }
  }, [difference, refreshToken, setRefreshTokenObject, tokenExpiryTime, username])

  const client = new ApolloClient({
    uri: "http://localhost:8000/graphql/",
    headers: {
        authorization: `Token ${authToken}`
    },
    cache: new InMemoryCache(),
  })

  const handleLogout = () => {
    setRefreshTokenObject({
      authToken: "",
      username: "",
      tokenExpiryTime: 999,
      refreshToken: "",
    })
  }


  const handleTime = () => {
      const newExpiryTime = moment.utc().unix() + (3*60)
      setRefreshTokenObject({
          authToken: authToken,
          username: username,
          tokenExpiryTime: newExpiryTime,
          refreshToken: refreshToken
      })
  }


  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/">
            {authToken === ""           ? 
              <Redirect to="/login" />  : 
              <HomePage 
                username={username} 
                authToken={authToken} 
                handleLogout={handleLogout} 
                handleTime={handleTime}
                resendQuery={resendQuery}
                setResendQuery={setResendQuery}
              />
            }
          </Route>
          <Route path="/profiles/:username">
            {authToken === ""           ?
              <Redirect to="/login" />  :
              <Profile 
                username={username}
                handleLogout={handleLogout}
                handleTime={handleTime}
                resendQuery={resendQuery}
                setResendQuery={setResendQuery}
              />
            }
          </Route>
          <Route path="/login">
            <Login 
              setRefreshTokenObject={setRefreshTokenObject}
              username={username}
            />
          </Route>
          <Route path="/signup">
            <Signup authToken={authToken} setRefreshTokenObject={setRefreshTokenObject}/>
          </Route>
          <Route path="*">
            <FourZeroFour />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;

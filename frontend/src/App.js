import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import usePersistentState from './lib/persistentState';
import Login from './components/login';
import Home from './components/home';
import Profile from './components/profile';
import FourZeroFour from './components/fourZeroFour';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import moment from 'moment';
import refreshAuthToken from './lib/refreshAuthToken';

function App() {
  const [{username, graphqlID, authToken, refreshToken, tokenExpiryTime}, setRefreshTokenObject] = usePersistentState("refreshTokenObject", {
    username: "",
    graphqlID: "",
    authToken: "",
    refreshToken: "",
    tokenExpiryTime: 999
  })

  const [resendQuery, setResendQuery] = useState(false)
  const [viewedProfileID, setViewedProfileID] = usePersistentState("viewedProfileID", "")

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
        graphqlID: graphqlID,
        authToken: token,
        refreshToken: refresh_token,
        tokenExpiryTime: tokenExpiryTime,
      })
    }

    if(refreshToken !== "" && difference.minutes() < 5 && difference.minutes() !== 0) {
      handleRefresh();
    }
  }, [difference, refreshToken, setRefreshTokenObject, tokenExpiryTime, username, graphqlID])

  if(authToken === "") {
    return <Login 
      setRefreshTokenObject={setRefreshTokenObject}
      username={username}
    />
  }

  const client = new ApolloClient({
    uri: "http://localhost:8000/graphql-token/",
    headers: {
        authorization: `Token ${authToken}`
    },
    cache: new InMemoryCache(),
  })

  const handleLogout = () => {
    setRefreshTokenObject({
      authToken: "",
      username: "",
      graphqlID: "",
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
            <Home 
              username={username} 
              graphqlID={graphqlID}
              setViewedProfileID={setViewedProfileID}
              authToken={authToken} 
              handleLogout={handleLogout} 
              handleTime={handleTime}
              resendQuery={resendQuery}
              setResendQuery={setResendQuery}
            />
          </Route>
          <Route path="/profiles/:username">
            <Profile 
              username={username}
              graphqlID={graphqlID}
              viewedProfileID={viewedProfileID}
              authToken={authToken}
              handleLogout={handleLogout}
              handleTime={handleTime}
              resendQuery={resendQuery}
              setResendQuery={setResendQuery}
            />
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

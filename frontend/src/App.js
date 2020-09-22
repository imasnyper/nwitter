import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import usePersistentState from './lib/persistentState';
import refreshAuthToken from './lib/refreshAuthToken';
import { useTraceUpdate } from './lib/helperFunctions'
import RoutingComponent from './components/routingComponent'

function App() {
  // useTraceUpdate()
  const [refreshTokenObject, setRefreshTokenObject] = usePersistentState("refreshTokenObject", {
      username: "",
      authToken: "",
      refreshToken: "",
      tokenExpiryTime: 999
  })

  const [resendQuery, setResendQuery] = useState(false)

  const currentUnixTime = moment.utc().unix();
  const unixDiff = refreshTokenObject.tokenExpiryTime - currentUnixTime
  const difference = moment.duration(unixDiff, 'seconds')
  console.log(difference.asMinutes())

  useEffect(() => {
    const handleRefresh = async () => {
      console.log("handle refresh called")
      const data = await refreshAuthToken(
        refreshTokenObject.username, 
        refreshTokenObject.refreshToken, 
      )
      const {token, refresh_token, tokenExpiryTime} = await data;
      setRefreshTokenObject({
        username: refreshTokenObject.username,
        authToken: token,
        refreshToken: refresh_token,
        tokenExpiryTime: tokenExpiryTime,
      })
    }

    const timeoutTime = (difference.asMinutes() - 5) * 60 * 1000
    let timer;
    if (timeoutTime > 1) {
      timer = setTimeout(() => handleRefresh(), timeoutTime)
    } 
    if (timeoutTime < 0) {
      handleRefresh()
    }

    return () => clearTimeout(timer);
  }, 
  [
    difference, 
    refreshTokenObject.refreshToken, 
    setRefreshTokenObject, 
    refreshTokenObject.tokenExpiryTime, 
    refreshTokenObject.username
  ])

  const client = new ApolloClient({
    uri: "http://localhost:8000/graphql/",
    headers: {
        authorization: `Token ${refreshTokenObject.authToken}`
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

  return (
    <ApolloProvider client={client}>
      <RoutingComponent 
        username={refreshTokenObject.username} 
        authToken={refreshTokenObject.authToken} 
        handleLogout={handleLogout} 
        resendQuery={resendQuery}
        setResendQuery={setResendQuery}
        setRefreshTokenObject={setRefreshTokenObject}
      />
    </ApolloProvider>
  );
}

export default App;

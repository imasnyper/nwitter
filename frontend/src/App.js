import React, { useState, useEffect } from 'react';
import './App.css';
import usePersistentState from './lib/persistentState';
import Login from './components/login'
import FollowedTweets from './components/followedTweets'
import ComposeTweet from './components/composeTweet'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import moment from 'moment'
import refreshAuthToken from './lib/refreshAuthToken'

function App() {
  const [{username, authToken, refreshToken, tokenExpiryTime}, setRefreshTokenObject] = usePersistentState("refreshTokenObject", {
    username: "",
    authToken: "",
    refreshToken: "",
    tokenExpiryTime: 999
  })
  
  const [resendQuery, setResendQuery] = useState(false)

  const expiryTimeObject = moment.unix(tokenExpiryTime).utc()
  // console.log(`expiryTimeObject.fromNow(): ${expiryTimeObject.fromNow()}`)
  // console.log(`expiryTimeObject.unix(): ${expiryTimeObject.unix()}`)
  // console.log(`moment.utc().unix(): ${moment.utc().unix()}`)
  // console.log("\n")
  // console.log(`expiryTimeObject.unix() - moment.utc().unix(): ${expiryTimeObject.unix() - moment.utc().unix()}`)
  // TODO: figure out why difference evalutates to 0 sometimes.
  const difference = moment.duration(expiryTimeObject.unix() - moment.utc().unix(), 'seconds')

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

    // console.log(`tokenExpiryTime: ${tokenExpiryTime}`)
    // console.log(`difference.minutes(): ${difference.minutes()}`)
    // console.log(`refreshToken !== "" && difference.minutes() < 5 && difference.minutes() !== 0: ${refreshToken !== "" && difference.minutes() < 5 && difference.minutes() !== 0}`)
    if(refreshToken !== "" && difference.minutes() < 5 && difference.minutes() !== 0) {
      handleRefresh();
    }
  }, [difference, refreshToken, setRefreshTokenObject, tokenExpiryTime, username])

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
      tokenExpiryTime: 99999,
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
      <div>
        <p>Welcome, {username}</p>
      </div>
      <div><button onClick={handleLogout}>Logout</button></div>
      <div><button onClick={handleTime}>Refresh Token</button></div>
      <ComposeTweet resendQuery={resendQuery} setResendQuery={setResendQuery}/>
      <FollowedTweets resendQuery={resendQuery} setResendQuery={setResendQuery}/>
    </ApolloProvider>
  );
}

export default App;

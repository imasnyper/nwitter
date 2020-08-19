import React from 'react';
import './App.css';
import usePersistentState from './lib/persistentState';
import Login from './components/login'
import FollowedTweets from './components/followedTweets'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import moment from 'moment'

function App() {
  const [authToken, setAuthToken] = usePersistentState("authToken", "")
  const [tokenExpiryTime, setTokenExpiryTime] = usePersistentState("tokenExpiryTime", 0)
  const [username, setUsername] = usePersistentState("username", "")

  const expiryTimeObject = moment.unix(tokenExpiryTime).utc()
  const difference = moment.duration(expiryTimeObject.unix() - moment.utc().unix(), 'seconds')

  if(authToken === "" || difference.minutes() < 5) {
    return <Login 
      setAuthToken={setAuthToken}
      setTokenExpiryTime={setTokenExpiryTime}
      username={username}
      setUsername={setUsername}
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
    setAuthToken("")
    setUsername("")
    setTokenExpiryTime(0)
  }

  return (
    <ApolloProvider client={client}>
      <div>
        <p>Welcome, {username}</p>
      </div>
      <div><button onClick={handleLogout}>Logout</button></div>
      <FollowedTweets username={username} />
    </ApolloProvider>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql-token/",
  headers: {
      authorization: `Token aa88288e75da938fb83cfdfe2b9b6372a65b31ec`
  },
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
    <App /> 
    {/* </ApolloProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

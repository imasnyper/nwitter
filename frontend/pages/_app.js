import '../styles/index.css'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo'
import { ALL_TWEETS } from '../gql/tweets'

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp

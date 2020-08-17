import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import Tweets from '../components/tweets'
import Navbar from '../components/navbar'
import { initializeApollo } from '../lib/apollo'
import { ALL_TWEETS } from '../gql/tweets'
import { ALL_USERS } from '../gql/users'

function Home() {

  return (
    <Layout>
      <Head>
        <title>Nwitter - The Twitter Clone</title>
      </Head>

      <h1>Nwitter</h1>
      <Navbar />
      <Tweets />
      
    </Layout>
  )
  
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
      query: ALL_TWEETS
  })

  return {
      props: {
          initialApolloState: apolloClient.cache.extract(),
      },
      revalidate: 1
  }
}

export default Home
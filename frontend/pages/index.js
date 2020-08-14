import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import Tweets from '../components/tweets'
import Navbar from '../components/navbar'
import { initializeApollo } from '../lib/apollo'
import { ALL_TWEETS } from '../gql/tweets'
import { ALL_USERS } from '../gql/users'
import { Sequelize, Model, DataTypes } from 'sequelize'

async function connectDatabase() {
  const sequelize = new Sequelize('nwitter', 'daniel', 'cyqgcnr4', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  })

  
  sequelize.authenticate()
    .then(console.log('connection has been successfully established'))
    .catch(console.error)
  
}

function Home() {

  return (
    <Layout>
      <Head>
        <title>Nwitter - The Twitter Clone</title>
      </Head>

      <h1>Nwitter</h1>
      <Navbar />
      <button onClick={connectDatabase}>Connect Database</button>
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
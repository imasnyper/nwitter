import { ALL_TWEETS } from '../gql/tweets'
import { useQuery } from '@apollo/client'
import Tweet from './tweet'

function Tweets() {
    const { loading, error, data, fetchMore } = useQuery(ALL_TWEETS, {notifyOnNetworkStatusChange: true})

    if(loading) return <p>Loading... ⌛</p>
    if(error) return `${error}`

    if(data && data.tweetCollection) {
        return (
            <ul>
                {data.tweetCollection.items.map(tweet => (
                    <li key={tweet.sys.id}><Tweet tweet={tweet}></Tweet></li>
                ))}
            </ul>
        )
    }
}

export async function getStaticProps() {
    const apolloClient = initializeApollo()
    
    console.log("getting static props")
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

export default Tweets
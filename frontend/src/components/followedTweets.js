import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_FOLLOWED_TWEETS } from '../gql/tweets'
import Tweets from '../components/tweets'

export default function FollowedTweets(props) {
    const { data, loading, error } = useQuery(ALL_FOLLOWED_TWEETS)

    if(loading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(error) {
        return <p>Error <span role="img" aria-label="crying">😭</span></p>
    }

    const tweets = data.allFollowedTweets

    return <Tweets tweets={tweets} />
}
import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_FOLLOWED_TWEETS } from '../gql/tweets'
import Tweets from '../components/tweets'

export default function FollowedTweets(props) {
    const {username} = props
    const { data, loading, error } = useQuery(ALL_FOLLOWED_TWEETS)

    if(loading) return <p>Loading... ⌛</p>
    if(error) {
        console.log(error)
        return <p>Error 😭</p>
    }

    const {allFollowedTweets} = data

    return <Tweets allFollowedTweets={allFollowedTweets} />
}
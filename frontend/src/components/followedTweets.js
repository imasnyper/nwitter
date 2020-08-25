import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_FOLLOWED_TWEETS } from '../gql/tweets'
import Tweets from '../components/tweets'

export default function FollowedTweets(props) {
    const { data, loading, error, refetch } = useQuery(ALL_FOLLOWED_TWEETS)
    
    useEffect(() => {
        if(props.resendQuery) {
            refetch()
            props.setResendQuery(false)
        }
    }, [props, refetch])

    if(loading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(error) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const tweets = data.allFollowedTweets.edges

    return <Tweets 
        tweets={tweets} 
        setViewedProfileID={props.setViewedProfileID}
    />
}
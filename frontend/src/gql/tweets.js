import { gql } from '@apollo/client'
import { loader } from 'graphql.macro'

const profileFragment = loader('./fragments/profileFragment.graphql')
const likeFragment = loader('./fragments/likeFragment.graphql')
const retweetFragment = loader('./fragments/retweetFragment.graphql')
const tweetFragment = loader('./fragments/tweetFragment.graphql')

export const ALL_TWEETS = gql`
query AllTweets {
  allTweets { 
    ...TweetFragment
  }
}
${tweetFragment}
`

export const ALL_FOLLOWED_TWEETS = gql`
query AllFollowedTweets {
  allFollowedTweets {
    ...TweetFragment 
  } 
}
${tweetFragment}
`

export const PROFILE_TWEETS = gql`
query ProfileTweets($profile: String!) {
  profileTweets(profile: $profile) {
    ...TweetFragment
  }
}
${tweetFragment}
`

export const ALL_FOLLOWED_TWEETS_AND_RETWEETS = gql`
query AllFollowedTweetsAndRetweets($first: Int, $after: Int) {
  allFollowedTweets(first: $first, after: $after) {
    ...TweetFragment
  }
  allFollowedRetweets(first: $first, after: $after) {
    ...RetweetFragment
  }
}
${tweetFragment}
${retweetFragment}
${profileFragment}
${likeFragment}
`

export const GET_TWEET = gql`
query getTweet($id: Int!) {
  getTweet(id: $id) {
    ...TweetFragment
  }
}
${tweetFragment}
`

export const COMPOSE_TWEET_MUTATION = gql`
mutation CreateTweet($text: String!) {
  createTweet(text: $text) {
    tweet {
      ...TweetFragment
    }
  }
}
${tweetFragment}
`

export const LIKE_TWEET_MUTATION = gql`
mutation LikeTweet($id: Int!) {
  likeTweet(id: $id) {
    tweet {
      ...TweetFragment
    }
  }
}
${tweetFragment}
`
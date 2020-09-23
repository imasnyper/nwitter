import { gql } from '@apollo/client'
import { loader } from 'graphql.macro'

// const profileDetailFragment = loader('./fragments/profileDetailFragment.graphql')
const retweetDetailFragment = loader('./fragments/retweetDetailFragment.graphql')
const tweetDetailFragment = loader('./fragments/tweetDetailFragment.graphql')

export const ALL_TWEETS = gql`
query AllTweets($first: Int, $after: Int) {
  allTweets(first: $first, after: $after) { 
    ...TweetDetailFragment
  }
}
${tweetDetailFragment}
`

export const ALL_FOLLOWED_TWEETS = gql`
query AllFollowedTweets($first: Int, $after: Int) {
  allFollowedTweets(first: $first, after: $after) {
    ...TweetDetailFragment 
  } 
}
${tweetDetailFragment}
`

export const PROFILE_TWEETS = gql`
query ProfileTweets($profile: String!, $first: Int, $after: Int) {
  profileTweets(profile: $profile, first: $first, after: $after) {
    ...TweetDetailFragment
  }
}
${tweetDetailFragment}
`

export const GET_TWEET = gql`
query getTweet($id: Int!) {
  getTweet(id: $id) {
    ...TweetDetailFragment
  }
}
${tweetDetailFragment}
`

export const COMPOSE_TWEET_MUTATION = gql`
mutation CreateTweet($text: String!) {
  createTweet(text: $text) {
    tweet {
      ...TweetDetailFragment
    }
  }
}
${tweetDetailFragment}
`

export const LIKE_TWEET_MUTATION = gql`
mutation LikeTweet($id: Int!) {
  likeTweet(id: $id) {
    tweet {
      ...TweetDetailFragment
    }
  }
}
${tweetDetailFragment}
`

export const RETWEET_TWEET_MUTATION = gql`
mutation RetweetTweet($id: Int!, $text: String) {
  retweetTweet(id: $id, text: $text) {
    tweet {
      ...TweetDetailFragment
    }
  }
}
${tweetDetailFragment}
`
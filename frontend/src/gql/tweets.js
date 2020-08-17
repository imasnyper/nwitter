import { gql } from '@apollo/client'

export const ALL_TWEETS = gql`
query AllTweets {
  allTweets { 
    id
    text
    profile {
      id
      user {
        id
        username
      }
    }
  }
}
`

export const ALL_FOLLOWED_TWEETS = gql`
query AllFollowedTweets {
  allFollowedTweets {
    id
    text
    profile {
      id
      user {
        id
        username
      }
    }
  }
}
`
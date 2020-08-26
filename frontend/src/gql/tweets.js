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
    likes
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
    likes
  }
}
`

export const PROFILE_TWEETS = gql`
query ProfileTweets($profile: String!) {
  profileTweets(profile: $profile) {
    id
    text
    profile {
      id
      user {
        id
        username
      }
    }
    likes
  }
}
`

export const COMPOSE_TWEET_MUTATION = gql`
mutation CreateTweet($text: String!) {
  createTweet(text: $text) {
    tweet {
      id 
      text
      profile {
        id
        user {
          id
          username
        }
      }
      likes
    }
  }
}
`

export const LIKE_TWEET_MUTATION = gql`
mutation LikeTweet($id: Int!) {
  likeTweet(id: $id) {
    tweet {
      id
      likes
      text
      profile {
        user {
          username
        }
      }
      likes
    }
  }
}
`
import { gql } from '@apollo/client'
import { loader } from 'graphql.macro'

const profileFragment = loader('./fragments/profileFragment.graphql')

export const PROFILE = gql`
query GetProfile($profile: String!) {
  profile(profile: $profile) {
    ...ProfileFragment
  }
}
${profileFragment}
`


export const FOLLOW_PROFILE_MUTATION = gql`
mutation FollowProfile($id: Int!) {
  followProfile(id: $id) {
    profile {
      ...ProfileFragment 
    }
  }
}
${profileFragment}
`
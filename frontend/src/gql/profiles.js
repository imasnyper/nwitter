import { gql } from '@apollo/client'
import { loader } from 'graphql.macro'

const profileDetailFragment = loader('./fragments/profileDetailFragment.graphql')

export const PROFILE = gql`
query GetProfile($profile: String!) {
  profile(profile: $profile) {
    ...ProfileDetailFragment
  }
}
${profileDetailFragment}
`


export const FOLLOW_PROFILE_MUTATION = gql`
mutation FollowProfile($id: Int!) {
  followProfile(id: $id) {
    profile {
      ...ProfileDetailFragment 
    }
  }
}
${profileDetailFragment}
`

export const EDIT_PROFILE_MUTATION = gql`
mutation EditProfile($bio: String, $location: String, $website: String, $birthday: Date) {
  editProfile(bio: $bio, location: $location, website: $website, birthday: $birthday) {
    profile {
      ...ProfileDetailFragment
    }
  }
}
${profileDetailFragment}
`
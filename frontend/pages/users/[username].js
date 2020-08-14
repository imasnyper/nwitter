import { useQuery } from '@apollo/client'
import { USER_BY_USERNAME, ALL_USERS, USER_SUPERMAN } from '../../gql/users'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../../components/navbar'

function User(props) {
    const router = useRouter()
    const { username } = router.query

    const userQueryVars = {
        username: `${username}`
    }
    const {loading, error, fetchMore, data} = useQuery(USER_BY_USERNAME, {
        variables: userQueryVars,
        notifyOnNetworkStatusChange: true,
    })
    
    if(loading) return <p>Loading... ⌛</p>
    if(error) {
        return `${error}`
    }
    if(data) {
        const user = data.userCollection.items[0]
        return (
            <>
                <Navbar />
                <h1>{user.username}</h1>
                <ul>
                    {user.followingCollection.items.map(item => (
                        <li key={item.sys.id}><Link href={`/users/${item.username}`}><a>{item.username}</a></Link></li>
                    ))}
                </ul>
            </>
        )
    }
}

export default User
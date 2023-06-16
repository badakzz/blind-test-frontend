import Link from 'next/link'
import { Button } from 'react-bootstrap'
import { GetServerSideProps } from 'next'
// import { withIronSession } from 'next-iron-session'
// import { IRON_SESSION_CONFIG } from '../../../utils/helpers'
import { useSession } from 'next-auth/react'

// export const getServerSideProps: GetServerSideProps = withIronSession(
//     async ({ req }) => {
//         const session = req.session.get('user')

//         return {
//             props: {
//                 user: session || null,
//             },
//         }
//     },
//     IRON_SESSION_CONFIG
// )

const Home: React.FC = () => {
    return (
        <div>
            <h1>Play Blind-Test with your friends using Spotify playlist!</h1>
            <p>
                Welcome to our Blind-Test game! You can start playing right away
                without logging in. However, if you want to use your own
                playlists and make it more fun, log in and enjoy!
            </p>
            <div>
                <Button>Play</Button>
                <Link href="auth/login">Not a member? Sign up now</Link>
                <p>
                    Or, join a <Link href="chat/chatroom">chat room</Link> and
                    talk with your friends!
                </p>
                <p>
                    Or, join a <Link href="auth/signup">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Home

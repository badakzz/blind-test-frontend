import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

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
                <Link to="/auth/login">Not a member? Sign up now</Link>
                <p>
                    Or, join a <Link to="/chat/chatroom">chat room</Link> and
                    talk with your friends!
                </p>
                <p>
                    Or, join a <Link to="/auth/signup">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Home

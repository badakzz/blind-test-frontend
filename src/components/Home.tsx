import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import axios from "axios"

const Home: React.FC = () => {
    const jwtToken = useSelector((state: RootState) => state.auth.token)
    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const putScore = async (score: any) => {
        await axios.put(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/scores`,
            score,
            {
                withCredentials: true,
                headers: {
                    //@ts-ignore
                    Authorization: `Bearer ${jwtToken}`,
                    "X-CSRF-TOKEN": csrfToken,
                },
            }
        )
    }

    const test = () => {
        putScore({
            chatroom_id: "liunu2qx0.8ac6pz8ylwh",
            user_id: 1,
            points: 1,
        })
    }

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
                <Link to="/login">Not a member? Sign up now</Link>
                <p>
                    Or, join a <Link to="/chatroom">chat room</Link> and talk
                    with your friends!
                </p>
                <p>
                    Or, join a <Link to="/signup">Sign up</Link>
                </p>
            </div>
            <Button onClick={test}>Click</Button>
        </div>
    )
}

export default Home

import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCSRFToken } from '../store/csrfSlice'
import { useApiClient } from '../utils/hooks/useApiClient'
import { useEffect } from 'react'

const Home: React.FC = () => {
    const dispatch = useDispatch()
    const csrfToken = useSelector((state: any) => state.csrf.token)
    const apiClient = useApiClient()

    const putScoreBoard = async (scoreboard: any) => {
        try {
            const response = await apiClient.put('/scoreboards', scoreboard) // Use the correct endpoint
            // Process the response if needed
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    const test = () => {
        putScoreBoard({
            chatroom_id: 'liunu2qx0.8ac6pz8ylwh',
            user_id: 1,
            points: 1,
        })
    }

    useEffect(() => {
        dispatch(getCSRFToken() as any)
    }, [dispatch])

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

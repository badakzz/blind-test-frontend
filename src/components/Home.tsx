import { Button, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { AuthState } from '../store/authSlice'

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth) as AuthState
    const navigate = useNavigate()

    const handlePlayButton = () => {
        if (user.user) return navigate('/chatroom')
        else return navigate('/login')
    }

    const handleGetPremiumButton = () => {
        return navigate('/chatroom')
    }

    return (
        <div className="d-flex flex-column flex-md-row align-items-center">
            <Container className="d-flex justifiy-content-center align-items-center welcome-container m-5 p-5">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <div>
                        <h4 className="md-5 mb-3">
                            Play Blind-Test with your friends using Spotify
                            playlist!
                        </h4>
                        <p>
                            Welcome to our Blind-Test game! In order to play,
                            you will need to login first. After that, create a
                            game and start inviting your friends!
                        </p>
                        Already have an account?{' '}
                        <Link to="/login">Sign up now</Link>
                        <p>
                            Not a member? <Link to="/signup">Sign up</Link>
                        </p>
                    </div>
                    <div className="d-flex">
                        <Button
                            onClick={handlePlayButton}
                            className="green-button mx-3 my-3"
                        >
                            Play
                        </Button>
                    </div>
                </div>
            </Container>
            <Container className="d-flex justify-content-center align-items-center support-us-container m-5 p-5">
                <div className="d-flex flex-row align-items-center justify-content-between custom-vertical-align">
                    <div>
                        <h4 className="d-flex md-5 justify-content-center mb-3">
                            Support us!
                        </h4>
                        <p>
                            Bored of using the same playlists over and over
                            again ? For 5€, unlock the premium membership for
                            life, and start browsing to Spotify, select and play
                            with any playlist you want!
                        </p>
                        <div className="d-flex justify-content-center ">
                            <Button
                                onClick={handleGetPremiumButton}
                                className="yellow-button my-3"
                            >
                                Get premium
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Home

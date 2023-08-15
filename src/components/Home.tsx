import { CSSProperties } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { AuthState } from '../store/authSlice'

const Home: React.FC = () => {
    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user
    const navigate = useNavigate()

    const handlePlayButton = () => {
        if (user) return navigate('/chatroom')
        else return navigate('/login')
    }

    const handleGetPremiumButton = () => {
        if (user) return navigate('/getpremium')
        else return navigate('/login')
    }

    return (
        <div className="d-flex home-container align-items-center">
            <Container
                className="d-flex justifiy-content-center align-items-center grey-container m-5 p-5"
                style={styles.container}
            >
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <div>
                        <h4 className="md-5 mb-3">
                            Play Blind-Test with your friends using Spotify
                            playlist!
                        </h4>
                        {user ? (
                            <p>
                                Welcome to our Blind-Test game! In order to
                                play, click on the play button to create a game,
                                then start inviting your friends!
                            </p>
                        ) : (
                            <>
                                <p>
                                    Welcome to our Blind-Test game! In order to
                                    play, you will need to log in first. After
                                    that, create a game and start inviting your
                                    friends!
                                </p>
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login">Log in</Link>
                                </p>
                                <p>
                                    Not a member?{' '}
                                    <Link to="/signup">Sign up</Link>
                                </p>
                            </>
                        )}
                    </div>
                    <div className="d-flex">
                        <Button
                            onClick={handlePlayButton}
                            className="green-button mx-3 my-3 fw-bold"
                        >
                            Play
                        </Button>
                    </div>
                </div>
            </Container>
            <Container
                className="d-flex justify-content-center align-items-center green-container m-5 p-5"
                style={styles.container}
            >
                <div className="d-flex flex-row align-items-center justify-content-between custom-vertical-align">
                    <div>
                        {user?.permissions !== 2 ? (
                            <>
                                <h4 className="d-flex md-5 justify-content-center mb-3">
                                    Support us!
                                </h4>
                                <p>
                                    Bored of using the same playlists over and
                                    over again? For 5€, unlock the premium
                                    membership for life, and start browsing to
                                    Spotify, select and play with any playlist
                                    you want!
                                </p>
                                <div className="d-flex justify-content-center ">
                                    <Button
                                        onClick={handleGetPremiumButton}
                                        className="yellow-button my-3 fw-bold"
                                    >
                                        Get premium
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex flex-column md-5 mb-3">
                                <h4 className="d-flex justify-content-center align-items-center">
                                    Thank you for supporting us!
                                </h4>
                                <p className="d-flex flex-column justify-content-between text-justify">
                                    You've now gained access to the all the
                                    Spotify playlists you want in your games,
                                    enjoy!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '30rem',
    },
}

export default Home

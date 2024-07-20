import { Modal, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Chatroom } from '../utils/types'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../utils/hooks'

interface Props {
    chatroom: Chatroom
    isHost: boolean
    resetGame: (chatroomId: string) => void
    closeGame: () => void
}

const Scoreboard: React.FC<Props> = ({
    chatroom,
    isHost,
    resetGame,
    closeGame,
}) => {
    const [show, setShow] = useState(true)
    const [scores, setScores] = useState([])

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const navigate = useNavigate()
    const { showToast } = useToast()

    const handleClose = () => {
        closeGame()
        setShow(false)
        return navigate('/')
    }
    const handleShow = () => setShow(true)

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await api.get(
                    `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/scores/chatroom/${chatroom.chatroomId}`,
                    {
                        withCredentials: true,
                        headers: {
                            'X-CSRF-TOKEN': csrfToken,
                        },
                    }
                )
                setScores(response.data)
            } catch (error) {
                showToast({ message: error })
            }
        }

        fetchScores()
    }, [chatroom.chatroomId])

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                animation={true}
                centered
            >
                <Modal.Header style={styles}>
                    <Modal.Title
                        style={{ color: '#ceac06', fontWeight: 'bold' }}
                    >
                        Scores
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={styles}>
                    <div className="d-flex flex-column gap-2">
                        {scores.map((score, index) => (
                            <p key={index}>
                                <span className="fw-bold">
                                    {score.username}
                                </span>
                                : {score.points}
                            </p>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer style={styles}>
                    <Button
                        className="green-button-sm-inverted"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    {isHost && (
                        <Button
                            className="green-button-sm-inverted"
                            onClick={() => resetGame(chatroom.chatroomId)}
                        >
                            Play Again
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Scoreboard

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

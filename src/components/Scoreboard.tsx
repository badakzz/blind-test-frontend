import { Modal, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Chatroom } from '../utils/types'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import api from '../api'

interface Props {
    chatroom: Chatroom
}

const Scoreboard: React.FC<Props> = ({ chatroom }) => {
    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const [show, setShow] = useState(true)
    const [scores, setScores] = useState([])

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await api.get(
                    `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/scores/chatroom/${chatroom.chatroomId}`,
                    {
                        withCredentials: true,
                        headers: {
                            'X-CSRF-TOKEN': csrfToken,
                        },
                    }
                )
                setScores(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchScores()
    }, [chatroom.chatroomId])

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Game End Scores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {scores.map((score, index) => (
                        <p key={index}>
                            {score.username}: {score.points}
                        </p>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Scoreboard

import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { useState, useEffect } from 'react'

interface Props {
    chatroomId: string
}

const Scoreboard: React.FC<Props> = ({ chatroomId }) => {
    const [show, setShow] = useState(true)
    const [scores, setScores] = useState([])

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get(`/api/${chatroomId}/scores`)
                setScores(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchScores()
    }, [chatroomId])

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Game End Scores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {scores.map((score, index) => (
                        <p key={index}>
                            {score.user_name}: {score.points}
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

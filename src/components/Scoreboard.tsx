import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { createApiClient } from '../utils/helpers'
import { useDispatch } from 'react-redux'
import { getCSRFToken } from '../store/csrfSlice'

interface Props {
    chatroomId: string
}

const Scoreboard: React.FC<Props> = ({ chatroomId }) => {
    const [show, setShow] = useState(true)
    const [scores, setScores] = useState([])

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const dispatch = useDispatch()
    const apiClient = createApiClient()

    // todo: check usage of csrf generation and csrf helper usage
    useEffect(() => {
        dispatch(getCSRFToken() as any)
    }, [dispatch])

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

    // check usage
    const postScoreBoard = async (scoreboard: any) => {
        try {
            const response = await apiClient.post(`/${chatroomId}/scores`)
        } catch (error) {
            console.error(error)
        }
    }

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

import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useApiClient } from '../utils/hooks/useApiClient'
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
    const apiClient = useApiClient()

    // todo: check usage of csrf generation and csrf helper usage
    // useEffect(() => {
    //     dispatch(getCSRFToken() as any)
    // }, [dispatch])

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/${chatroomId}/scores`
                )
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

    const test = () => {
        postScoreBoard({
            chatroomId: 'liunu2qx0.8ac6pz8ylwh',
            user_id: 1,
            points: 1,
        })
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
                    <Button variant="secondary" onClick={test}>
                        Test
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Scoreboard

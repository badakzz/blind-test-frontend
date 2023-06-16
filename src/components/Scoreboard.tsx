import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useToastContext } from '../../utils/hooks'

interface Props {
    chatroomId: string
}
const Scoreboard: React.FC<Props> = ({ chatroomId: chatroomId }) => {
    const [show, setShow] = useState(true)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const { showErrorToast } = useToastContext()

    const queryClient = useQueryClient()
    const QK_SCORES = 'scoreboard'

    const fetchScores = async (chatroomId: string) => {
        return axios.get(`/api/${chatroomId}/scores`).then(({ data }) => data)
    }

    const { isLoading, error, data, isSuccess } = useQuery(
        QK_SCORES,
        () => fetchScores(chatroomId),
        {
            onError: (e) => showErrorToast(e),
        }
    )
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Game End Scores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {data &&
                        !isLoading &&
                        data.map((score: any, index: number) => (
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

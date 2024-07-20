import React, { CSSProperties, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { User } from '../utils/types'
import { useToast } from '../utils/hooks'

type Props = {
    user: User | null
    createRoom: (csrfToken: any, username?: string) => void
    joinRoom: (csrfToken: any, chatroomId: string, username?: string) => void
    onShow: React.Dispatch<boolean>
    onRoomEntered: React.Dispatch<boolean>
}

const CreateOrJoinRoom: React.FC<Props> = ({
    user,
    createRoom,
    joinRoom,
    onShow,
    onRoomEntered,
}) => {
    const [username, setUsername] = useState('')
    const [chatroomId, setChatroomId] = useState('')

    const { showToast } = useToast()

    useEffect(() => {
        setUsername(user ? user.username : 'Guest')
    }, [user])

    const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            await createRoom(username)
            onShow(true)
            onRoomEntered(true)
        } catch (e) {
            showToast({ message: e.message || e.toString() })
        }
    }

    const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            await joinRoom(chatroomId, username)
            onRoomEntered(true)
        } catch (e) {
            showToast({ message: e.message || e.toString() })
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 grey-container"
            style={styles.container}
        >
            <h4>Create / Join game</h4>
            <Form>
                <Form.Group>
                    <Form.Label htmlFor="username">Username:</Form.Label>
                    <div className="d-flex flex-column flex-md-row gap-5 mb-5">
                        <Form.Control
                            className="form-input-sm"
                            type="text"
                            id="username"
                            value={username}
                            readOnly={!!user}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Button className="green-button" onClick={handleCreate}>
                            Create Room
                        </Button>
                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="chatroomId">
                        Chatroom ID (leave blank to create a new room):
                    </Form.Label>
                    <div className="d-flex flex-column flex-md-row gap-5 mb-5">
                        <Form.Control
                            className="form-input-sm"
                            type="text"
                            id="chatroomId"
                            value={chatroomId}
                            onChange={(e) => setChatroomId(e.target.value)}
                        />
                        <Button
                            className="green-button"
                            disabled={!chatroomId}
                            onClick={handleJoin}
                        >
                            Join Room
                        </Button>
                    </div>
                </Form.Group>
            </Form>
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '20rem',
    },
}

export default CreateOrJoinRoom

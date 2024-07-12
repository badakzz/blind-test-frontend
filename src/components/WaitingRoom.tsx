import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import UsersInRoom from './UsersInRoom'
import { AuthState } from '../store/authSlice'
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_SERVER_DOMAIN)

interface WaitingRoomProps {
    connectedUsers: string[]
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ connectedUsers }) => {
    const navigate = useNavigate()
    const [hostLeft, setHostLeft] = useState(false)

    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    }, [navigate, user])

    useEffect(() => {
        socket.on('hostLeft', () => {
            setHostLeft(true)
        })

        return () => {
            socket.off('hostLeft')
        }
    }, [])

    useEffect(() => {
        if (hostLeft) {
            navigate('/')
        }
    }, [hostLeft, navigate])

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 grey-container"
            style={styles.container}
        >
            <p>Waiting for the host to start the game...</p>
            <UsersInRoom
                className="users-connected-container"
                upperClassName="users-connected-wrapper"
                subClassName="text-align-center"
                connectedUsers={connectedUsers}
            />
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '20rem',
    },
}

export default WaitingRoom

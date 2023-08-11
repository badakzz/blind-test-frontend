import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
    const [socket, setSocket] = useState(null)
    const [connectedUsers, setConnectedUsers] = useState([])

    useEffect(() => {
        const newSocket = io(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}`
        )
        setSocket(newSocket)

        newSocket.on('connectedUsers', (users) => {
            const usernames = users.map((user) => user.username)
            setConnectedUsers(usernames)
        })

        return () => {
            newSocket.off('connectedUsers')
            newSocket.disconnect()
        }
    }, [])

    return { socket, connectedUsers }
}

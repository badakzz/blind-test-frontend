import React, { useEffect, useState } from 'react'
import { User } from '../utils/types'

type Props = {
    user: User | null
    onCreate: (username: string) => void
    onJoin: (username: string, chatroomId: string) => void
}

const CreateOrJoinRoom: React.FC<Props> = ({ onCreate, onJoin, user }) => {
    const [username, setUsername] = useState('')
    const [chatroomId, setChatroomId] = useState('')

    useEffect(() => {
        user && setUsername(user.username)
    }, [user])

    const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onCreate(username)
    }

    const handleJoin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onJoin(username, chatroomId)
    }

    return (
        <div>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                readOnly={!!user}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <label htmlFor="chatroomId">
                Chatroom ID (leave blank to create a new room):
            </label>
            <input
                type="text"
                id="chatroomId"
                value={chatroomId}
                onChange={(e) => setChatroomId(e.target.value)}
            />

            <button onClick={handleCreate}>Create Room</button>
            <button onClick={handleJoin}>Join Room</button>
        </div>
    )
}

export default CreateOrJoinRoom

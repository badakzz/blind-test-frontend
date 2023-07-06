import React, { useEffect, useState } from 'react'
import { User } from '../utils/types'

type Props = {
    user: User | null
    createRoom: (user: User) => void
    joinRoom: (user: User, chatroomId: string) => void
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

    useEffect(() => {
        user && setUsername(user.username)
    }, [user])

    const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        createRoom(user)
        onShow(true)
        onRoomEntered(true)
    }

    const handleJoin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            joinRoom(user, chatroomId)
            onRoomEntered(true)
        } catch (e) {
            console.error(e)
        }
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

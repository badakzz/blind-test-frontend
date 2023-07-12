import { useState } from 'react'
import axios from 'axios'

export const useChatroomManager = (socket) => {
    const [currentChatroom, setCurrentChatroom] = useState(null)

    const createRoom = async (username, csrfToken) => {
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms`,
            {},
            {
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            }
        )
        const chatroom = response.data
        const formattedChatroom = {
            chatroomId: chatroom.chatroom_id,
        }
        setCurrentChatroom(formattedChatroom)
        socket.emit('createRoom', username, chatroom.chatroom_id)
    }

    const joinRoom = async (username, chatroomId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms/${chatroomId}`
            )
            const chatroom = response.data
            const formattedChatroom = {
                chatroomId: chatroom.chatroom_id,
            }
            setCurrentChatroom(formattedChatroom)
            if (chatroom.chatroom_id) {
                socket.emit('joinRoom', username, chatroomId)
            } else {
                throw new Error(
                    'Unable to find the chatroom. Please make sure it has been created already'
                )
            }
        } catch (error) {
            console.error(error)
        }
    }

    return { createRoom, joinRoom, currentChatroom }
}

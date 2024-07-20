import { useState } from 'react'
import api from '../../api'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const useChatroomManager = (socket) => {
    const [currentChatroom, setCurrentChatroom] = useState(null)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const createRoom = async (username?: string) => {
        try {
            const response = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/chatrooms`,
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
        } catch (error) {
            throw new Error(`Failed to create room: ${error.message}`)
        }
    }

    const joinRoom = async (chatroomId: string, username?: string) => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/chatrooms/${chatroomId}`,
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
            if (chatroom.chatroom_id) {
                socket.emit('joinRoom', username, chatroomId)
            } else {
                throw new Error(
                    'Unable to find the chatroom. Please make sure it has been created already'
                )
            }
        } catch (error) {
            throw new Error(`'Failed to join room :' ${error.message}`)
        }
    }

    return { createRoom, joinRoom, currentChatroom }
}

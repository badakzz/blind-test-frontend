import { useState } from 'react'
import api from '../../api'

export const useChatroomManager = (socket) => {
    const [currentChatroom, setCurrentChatroom] = useState(null)

    const createGuestUser = async (csrfToken) => {
        try {
            const response = await api.post(
                '/api/v1/users',
                { is_guest: true },
                {
                    withCredentials: true,
                    headers: { 'X-CSRF-TOKEN': csrfToken },
                }
            )
            return response.data
        } catch (error) {
            throw new Error(`Failed to create guest user: ${error.message}`)
        }
    }

    const createRoom = async (csrfToken, username?: string) => {
        try {
            let finalUsername = username

            if (!username) {
                const guestUser = await createGuestUser(csrfToken)
                finalUsername = guestUser.username
            }

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
            socket.emit('createRoom', finalUsername, chatroom.chatroom_id)
        } catch (error) {
            throw new Error(`Failed to create room: ${error.message}`)
        }
    }

    const joinRoom = async (
        csrfToken,
        chatroomId: string,
        username?: string
    ) => {
        try {
            let finalUsername = username

            if (!username) {
                const guestUser = await createGuestUser(csrfToken)
                finalUsername = guestUser.username
            }

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
                socket.emit('joinRoom', finalUsername, chatroomId)
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

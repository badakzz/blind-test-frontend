import { useState } from 'react'
import api from '../../api'
import { useToast } from './'

export const useChatroomManager = (socket) => {
    const [currentChatroom, setCurrentChatroom] = useState(null)
    const { showToast } = useToast()

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
            console.error('Error creating guest user:', error)
            throw error
        }
    }

    const createRoom = async (username: string, csrfToken) => {
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
            console.error(error)
            if (error.response && error.response.status === 401) {
                showToast({ message: error.message })
            }
        }
    }

    const joinRoom = async (username: string, chatroomId, csrfToken) => {
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
            console.error(error)
            if (error.response && error.response.status === 401) {
                showToast({ message: error.message })
            }
        }
    }

    return { createRoom, joinRoom, currentChatroom }
}

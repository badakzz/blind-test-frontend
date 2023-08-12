import { useState } from 'react'
import api from '../../api'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { AuthState } from '../../store/authSlice'

export const useChatroomManager = (socket) => {
    const [currentChatroom, setCurrentChatroom] = useState(null)
    const navigate = useNavigate()

    const authUser = useSelector((state: RootState) => state.auth) as AuthState

    const createRoom = async (username, csrfToken) => {
        try {
            const response = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/chatrooms`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${authUser.token}`,
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
            console.error(error)
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('user')
                navigate('/login')
            }
        }
    }

    const joinRoom = async (username, chatroomId) => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/chatrooms/${chatroomId}`
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
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('user')
                navigate('/login')
            }
        }
    }
    return { createRoom, joinRoom, currentChatroom }
}

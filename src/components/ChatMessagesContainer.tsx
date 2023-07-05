import React, { useState } from "react"
import { User, ChatMessage, Chatroom } from "../utils/types"
import { Socket } from "socket.io-client"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../store"

type Props = {
    messages: ChatMessage[]
    user: User
    connectedUsers: string[]
    currentChatroom: Chatroom
    socket: Socket
    currentSongPlaying: string
}

const ChatMessagesContainer: React.FC<Props> = ({
    messages,
    connectedUsers,
    user,
    currentChatroom,
    socket,
    currentSongPlaying,
}) => {
    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const [message, setMessage] = useState("")
    const sendMessageHandler = () => {
        if (message) {
            axios.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chat_messages`,
                {
                    chatroom_id: currentChatroom.chatroomId,
                    user_id: user.userId,
                    content: message,
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                    },
                }
            )
            socket.emit("chatMessage", {
                author: user.username,
                chatroomId: currentChatroom.chatroomId,
                content: message,
                userId: user.userId,
            } as ChatMessage)
            socket.emit("")
            setMessage("")
        }
    }
    console.log("messages", messages)
    return (
        <>
            <div>
                {messages.map((msg, i) => (
                    <div key={i}>
                        <span>{msg.author}: </span>
                        <span>{msg.content}</span>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessageHandler}>Send</button>
            </div>
            <div>
                Users online: {connectedUsers.map((user) => user).join(", ")}
            </div>
        </>
    )
}

export default ChatMessagesContainer

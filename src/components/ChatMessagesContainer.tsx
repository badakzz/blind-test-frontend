import React, {
    useState,
    FormEvent,
    CSSProperties,
    useEffect,
    useRef,
} from 'react'
import { User, ChatMessage, Chatroom } from '../utils/types'
import { Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import api from '../api'
import { Button, Form } from 'react-bootstrap'
import UsersInRoom from './UsersInRoom'

type Props = {
    messages: ChatMessage[]
    user: User
    currentChatroom: Chatroom
    socket: Socket
    connectedUsers: string[]
}

const ChatMessagesContainer: React.FC<Props> = ({
    messages,
    user,
    currentChatroom,
    socket,
    connectedUsers,
}) => {
    const [message, setMessage] = useState('')
    const messageContainerRef = useRef<HTMLDivElement>(null)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const sendMessageHandler = (e: FormEvent) => {
        e.preventDefault()
        if (message) {
            api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/chat_messages`,
                {
                    chatroom_id: currentChatroom.chatroomId,
                    user_id: user.userId,
                    content: message,
                },
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            )
            socket.emit('chatMessage', {
                author: user.username,
                chatroomId: currentChatroom.chatroomId,
                content: message,
                userId: user.userId,
            } as ChatMessage)
            setMessage('')
        }
    }

    useEffect(() => {
        const container = messageContainerRef.current
        if (container) {
            container.scrollTop = 0
        }
    }, [messages])

    return (
        <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-start">
                <div
                    className="col-9 message-container m-5"
                    ref={messageContainerRef}
                >
                    {messages
                        .slice()
                        .reverse()
                        .map((msg, i) => (
                            <div className="m-3" key={i}>
                                <span style={styles.author}>
                                    {msg.author}:{' '}
                                </span>
                                <span
                                    style={
                                        msg.author === 'SYSTEM'
                                            ? styles.systemMessage
                                            : styles.userMessage
                                    }
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                </div>
                <UsersInRoom
                    className="users-connected-container"
                    upperClassName="m-5 users-connected-wrapper-no-margin"
                    subClassName="text-align-center"
                    connectedUsers={connectedUsers}
                />
            </div>
            <Form onSubmit={sendMessageHandler}>
                <div className="d-flex flex-row mx-5 mt-3">
                    <Form.Control
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button className="green-button-sm mx-1" type="submit">
                        Send
                    </Button>
                </div>
            </Form>
        </div>
    )
}

const styles: { [key: string]: CSSProperties } = {
    author: {
        fontWeight: 'bold',
    },
    systemMessage: {
        color: 'grey',
        fontStyle: 'italic',
    },
    userMessage: {
        color: 'grey',
    },
}

export default ChatMessagesContainer

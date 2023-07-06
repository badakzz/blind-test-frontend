import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { User } from '../utils/types/User'
import {
    ChatMessagesContainer,
    CreateOrJoinChatroom,
    PlaylistSelectionModal,
    Scoreboard,
} from './'
import { useSocket } from '../utils/hooks'
import { useAudioManager } from '../utils/hooks'
import { useGameManager } from '../utils/hooks'
import { useChatroomManager } from '../utils/hooks'
import { usePlaylistManager } from '../utils/hooks'
import { TrackPreviewContext } from '../utils/context/TrackPreviewContext'

interface ChatroomProps {
    user: User | null
}

const Chatroom: React.FC<ChatroomProps> = ({ user }) => {
    const [messages, setMessages] = useState([])
    const [showModalPlaylistSelection, setShowModalPlaylistSelection] =
        useState(false)
    const handleHideModal = () => setShowModalPlaylistSelection(false)
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const [isWaitingForHost, setIsWaitingForHost] = useState<boolean>(false)
    const [isHost, setIsHost] = useState<boolean>(false)

    const trackPreviewContext = useContext(TrackPreviewContext)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const { socket, connectedUsers } = useSocket()

    const { gameStarted, currentSong, isGameOver, startGame, endGame } =
        useGameManager(socket, isHost)

    const { audio, playTrack } = useAudioManager(isGameOver)

    const { createRoom, joinRoom, currentChatroom } = useChatroomManager(socket)

    const { trackPreviewList, currentSongPlaying, setCurrentSongPlaying } =
        usePlaylistManager(playlistId, currentChatroom, csrfToken, socket)

    useEffect(() => {
        if (currentSong) {
            const songId = playTrack(currentSong)
            if (songId) {
                setCurrentSongPlaying(songId)
            }
        }
    }, [currentSong])

    useEffect(() => {
        if (socket) {
            // Clean up old event listeners
            socket.off('chatMessage')
            socket.off('scoreUpdated')

            // Set up new event listeners
            socket.on('chatMessage', (msg) => {
                setMessages((currentMsg) => [...currentMsg, msg])
            })
        }
    }, [socket])

    console.log({ trackPreviewList, 2: currentChatroom?.chatroomId })

    useEffect(() => {
        console.log('trackPrev', trackPreviewList)
        if (trackPreviewList.length > 0 && currentChatroom) {
            startGame(trackPreviewList, currentChatroom.chatroomId)
        }
    }, [trackPreviewList, currentChatroom])

    useEffect(() => {
        if (gameStarted) {
            setIsWaitingForHost(false)
        }
    }, [gameStarted])

    console.log({ connectedUsers })
    return (
        <>
            {!currentChatroom && (
                <CreateOrJoinChatroom
                    createRoom={() => {
                        createRoom(user.username, csrfToken)
                        setIsHost(true)
                    }}
                    joinRoom={(user, chatroomId) => {
                        joinRoom(user.username, chatroomId)
                        setIsWaitingForHost(true)
                        setIsHost(false)
                    }}
                    user={user}
                    setShowModalPlaylistSelection={
                        setShowModalPlaylistSelection
                    }
                />
            )}
            {currentChatroom && (
                <PlaylistSelectionModal
                    currentChatroom={currentChatroom}
                    show={showModalPlaylistSelection}
                    onHide={handleHideModal}
                    onPlaylistSelected={setPlaylistId}
                />
            )}
            {gameStarted &&
                currentChatroom &&
                (isWaitingForHost && !isHost ? (
                    <p>Waiting for the host to start the game...</p>
                ) : (
                    <ChatMessagesContainer
                        messages={messages}
                        user={user}
                        socket={socket}
                        connectedUsers={connectedUsers}
                        currentChatroom={currentChatroom}
                    />
                ))}
            {gameStarted && isGameOver && (
                <Scoreboard chatroom={currentChatroom} />
            )}
        </>
    )
}

export default Chatroom

import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { User } from "../utils/types/User"
import {
    ChatMessagesContainer,
    CreateOrJoinChatroom,
    PlaylistSelectionModal,
    Scoreboard,
} from "./"
import { useSocket } from "../utils/hooks"
import { useAudioManager } from "../utils/hooks"
import { useGameManager } from "../utils/hooks"
import { useChatroomManager } from "../utils/hooks"
import { usePlaylistManager } from "../utils/hooks"

interface ChatroomProps {
    user: User | null
}

const Chatroom: React.FC<ChatroomProps> = ({ user }) => {
    const [messages, setMessages] = useState([])
    const [showModalPlaylistSelection, setShowModalPlaylistSelection] =
        useState(false)
    const handleHideModal = () => setShowModalPlaylistSelection(false)
    const [playlistId, setPlaylistId] = useState<string | null>(null)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const { socket, connectedUsers } = useSocket()

    const { gameStarted, currentSong, isGameOver, startGame, endGame } =
        useGameManager(socket)

    const { audio, playTrack } = useAudioManager(isGameOver)

    const { createRoom, joinRoom, currentChatroom } = useChatroomManager(socket)

    const { trackPreviewList, currentSongPlaying, setCurrentSongPlaying } =
        usePlaylistManager(playlistId, currentChatroom, csrfToken)

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
            socket.off("chatMessage")
            socket.off("scoreUpdated")

            // Set up new event listeners
            socket.on("chatMessage", (msg) => {
                setMessages((currentMsg) => [...currentMsg, msg])
            })
        }
    }, [socket])

    useEffect(() => {
        console.log("trackPrev", trackPreviewList)
        if (trackPreviewList.length > 0 && currentChatroom) {
            startGame(trackPreviewList)
        }
    }, [trackPreviewList, currentChatroom])

    console.log({ connectedUsers })
    return (
        <>
            {!currentChatroom && (
                <CreateOrJoinChatroom
                    createRoom={() => createRoom(user.username, csrfToken)}
                    joinRoom={(
                        user,
                        chatroomId // Add chatroomId parameter here
                    ) => joinRoom(user.username, chatroomId)}
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
            {gameStarted && currentChatroom && (
                <ChatMessagesContainer
                    messages={messages}
                    user={user}
                    socket={socket}
                    connectedUsers={connectedUsers}
                    currentChatroom={currentChatroom}
                />
            )}
            {gameStarted && isGameOver && (
                <Scoreboard chatroom={currentChatroom} />
            )}
        </>
    )
}

export default Chatroom

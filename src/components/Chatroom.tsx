import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { User } from '../utils/types/User'
import {
    ChatMessagesContainer,
    CreateOrJoinChatroom,
    PlaylistSelectionModal,
    Scoreboard,
    UsersInRoom,
} from './'
import { useSocket } from '../utils/hooks'
import { useAudioManager } from '../utils/hooks'
import { useGameManager } from '../utils/hooks'
import { useChatroomManager } from '../utils/hooks'
import { usePlaylistManager } from '../utils/hooks'

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
    const [trackPreviewList, setTrackPreviewList] = useState([])
    const [isInRoom, setIsInRoom] = useState<boolean>(false)
    console.log('playlistId', playlistId)
    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const { socket, connectedUsers } = useSocket()

    const { gameStarted, currentSong, isGameOver, startGame } = useGameManager(
        socket,
        isHost
    )

    const { audio, playTrack } = useAudioManager(isGameOver)

    const { createRoom, joinRoom, currentChatroom } = useChatroomManager(socket)

    const { currentSongPlaying, setCurrentSongPlaying } = usePlaylistManager(
        playlistId,
        currentChatroom,
        csrfToken,
        trackPreviewList,
        setTrackPreviewList
    )

    const playNextTrack = (currentTrackIndex) => {
        if (currentTrackIndex < trackPreviewList.length - 1) {
            const nextTrack = trackPreviewList[currentTrackIndex + 1]
            const songId = playTrack(nextTrack, () =>
                playNextTrack(currentTrackIndex + 1)
            )
            if (songId) {
                setCurrentSongPlaying(songId)
            }
        }
    }

    useEffect(() => {
        if (currentSong) {
            const currentTrackIndex = trackPreviewList.findIndex(
                (track) => track.song_id === currentSong.song_id
            )
            playNextTrack(currentTrackIndex)
        }
    }, [currentSong])

    // useEffect(() => {
    //     if (currentSong) {
    //         const songId = playTrack(currentSong)
    //         console.log("returned id from playtrack", songId)
    //         if (songId) {
    //             setCurrentSongPlaying(songId)
    //         }
    //     }
    // }, [currentSong])

    useEffect(() => {
        if (socket) {
            // Clean up old event listeners
            socket.off('chatMessage')
            socket.off('scoreUpdated')

            // Set up new event listeners
            socket.on('chatMessage', (msg) => {
                setMessages((currentMsg) => [...currentMsg, msg])
            })
            socket.on('gameStarted', ({ currentSong, trackPreviewList }) => {
                setTrackPreviewList(trackPreviewList)
            })
        }
    }, [socket])

    useEffect(() => {
        if (currentSongPlaying && currentChatroom && socket) {
            // Emit event to server with current song
            console.log(
                'currentSongPlaying event sent',
                currentChatroom.chatroomId,
                currentSongPlaying
            )
            socket.emit('currentSongPlaying', {
                chatroomId: currentChatroom.chatroomId,
                currentSongPlaying: currentSongPlaying,
            })
        }
    }, [currentSongPlaying, currentChatroom, socket])

    useEffect(() => {
        if (trackPreviewList.length > 0 && currentChatroom) {
            startGame(trackPreviewList, currentChatroom.chatroomId, isHost)
        }
    }, [trackPreviewList, currentChatroom])

    useEffect(() => {
        if (gameStarted) {
            setIsWaitingForHost(false)
        }
    }, [gameStarted])

    return (
        <>
            {!isInRoom && (
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
                    onShow={setShowModalPlaylistSelection}
                    onRoomEntered={setIsInRoom}
                />
            )}
            {currentChatroom && !isWaitingForHost && (
                <PlaylistSelectionModal
                    currentChatroom={currentChatroom}
                    show={showModalPlaylistSelection}
                    onHide={handleHideModal}
                    onPlaylistSelected={setPlaylistId}
                />
            )}
            {!currentSong && isWaitingForHost && !isHost && (
                <p>Waiting for the host to start the game...</p>
            )}
            {currentSong && (
                <ChatMessagesContainer
                    messages={messages}
                    user={user}
                    socket={socket}
                    currentChatroom={currentChatroom}
                />
            )}
            {isInRoom && <UsersInRoom connectedUsers={connectedUsers} />}
            {isGameOver && <Scoreboard chatroom={currentChatroom} />}
        </>
    )
}

export default Chatroom

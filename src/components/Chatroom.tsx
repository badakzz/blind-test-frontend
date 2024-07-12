import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import {
    ChatMessagesContainer,
    CreateOrJoinChatroom,
    PlaylistPicker,
    Scoreboard,
    CountdownBar,
    TimeUpMessage,
    WaitingRoom,
} from './'
import { useSocket, useToast } from '../utils/hooks'
import { useAudioManager } from '../utils/hooks'
import { useGameManager } from '../utils/hooks'
import { useChatroomManager } from '../utils/hooks'
import { usePlaylistManager } from '../utils/hooks'
import { useNavigate } from 'react-router-dom'
import { AuthState } from '../store/authSlice'

const Chatroom: React.FC = () => {
    const [messages, setMessages] = useState([])
    const [showPlaylistPicker, setShowPlaylistPicker] = useState(false)
    const handleHidePlaylistPicker = () => setShowPlaylistPicker(false)
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const [isWaitingForHost, setIsWaitingForHost] = useState<boolean>(false)
    const [isHost, setIsHost] = useState<boolean>(false)
    const [trackPreviewList, setTrackPreviewList] = useState([])
    const [isInRoom, setIsInRoom] = useState<boolean>(false)
    const [, setCurrentSongIndex] = useState<number>(0)
    const [isSearchSelection, setIsSearchSelection] = useState<boolean>(false)

    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const navigate = useNavigate()

    const { socket, connectedUsers } = useSocket()
    const { showToast } = useToast()

    const {
        gameStarted,
        firstSong,
        isGameOver,
        startGame,
        closeGame,
        resetGame,
        setFirstSong,
    } = useGameManager(
        socket,
        setTrackPreviewList,
        isHost,
        setShowPlaylistPicker,
        setIsWaitingForHost
    )

    const { createRoom, joinRoom, currentChatroom } = useChatroomManager(socket)

    const {
        audio,
        playTrack,
        isAudioPlaying,
        setIsAudioPlaying,
        currentSongCredentials,
    } = useAudioManager(isGameOver, socket, currentChatroom, isHost)

    const {
        currentSongPlaying,
        setCurrentSongPlaying,
        fetchError,
        selectPlaylist,
    } = usePlaylistManager(
        playlistId,
        currentChatroom,
        trackPreviewList,
        setTrackPreviewList
    )

    useEffect(() => {
        if (!user) {
            return navigate('/')
        }
    }, [navigate, user])

    const playNextTrack = () => {
        setCurrentSongIndex((prevIndex) => {
            if (prevIndex < trackPreviewList.length - 1) {
                const nextTrack = trackPreviewList[prevIndex + 1]
                setIsAudioPlaying(true)
                const songId = playTrack(nextTrack, playNextTrack)
                if (songId) {
                    setCurrentSongPlaying(songId)
                }
                return prevIndex + 1
            } else {
                return prevIndex
            }
        })
    }

    useEffect(() => {
        return () => {
            setMessages([])
            setIsInRoom(false)
            setIsHost(false)
            setIsWaitingForHost(false)
            setIsSearchSelection(false)
            setCurrentSongIndex(0)
            setPlaylistId(null)
            setFirstSong(null)
            setShowPlaylistPicker(false)
            setTrackPreviewList(null)
            if (audio) {
                audio.src = ''
                audio.pause()
            }
            if (socket) {
                socket.disconnect()
            }
        }
    }, [])

    useEffect(() => {
        if (firstSong) {
            const index = trackPreviewList.findIndex(
                (track) => track.song_id === firstSong.song_id
            )
            setCurrentSongIndex(index)
            const songId = playTrack(firstSong, playNextTrack)
            if (songId) {
                setCurrentSongPlaying(songId)
            }
        }
    }, [firstSong])

    useEffect(() => {
        if (socket) {
            socket.off('chatMessage')

            socket.on('chatMessage', (msg) => {
                setMessages((currentMsg) => [...currentMsg, msg])
            })

            socket.on('gameStarted', ({ firstSong, trackPreviewList }) => {
                setTrackPreviewList(trackPreviewList)
            })
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket.off('syncTimeOut')

            socket.on('syncTimeOut', async () => {
                playNextTrack()
                setIsAudioPlaying(true)
            })
        }
    }, [socket, playNextTrack])

    useEffect(() => {
        if (currentSongPlaying && currentChatroom && socket) {
            socket.emit('currentSongPlaying', {
                chatroomId: currentChatroom.chatroomId,
                currentSongPlaying: currentSongPlaying,
            })
        }
    }, [currentSongPlaying, currentChatroom, socket])

    useEffect(() => {
        if (
            trackPreviewList &&
            trackPreviewList.length > 0 &&
            currentChatroom
        ) {
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
                    onShow={setShowPlaylistPicker}
                    onRoomEntered={setIsInRoom}
                />
            )}
            {!firstSong && currentChatroom && !isWaitingForHost && (
                <PlaylistPicker
                    currentChatroom={currentChatroom}
                    show={showPlaylistPicker}
                    onHide={handleHidePlaylistPicker}
                    onPlaylistSelected={setPlaylistId}
                    isInRoom={isInRoom}
                    connectedUsers={connectedUsers}
                    setIsSearchSelection={setIsSearchSelection}
                    isSearchSelection={isSearchSelection}
                    selectPlaylist={selectPlaylist}
                />
            )}
            {!firstSong && isWaitingForHost && !isHost && (
                <WaitingRoom connectedUsers={connectedUsers} />
            )}
            {firstSong && !isGameOver && (
                <>
                    {!isAudioPlaying ? (
                        <TimeUpMessage song={currentSongCredentials} />
                    ) : (
                        <div className="mt-5"></div>
                    )}
                    <CountdownBar
                        duration={isAudioPlaying ? 30 : 5}
                        color={isAudioPlaying ? '#1db954' : '#FFEF9C'}
                        socket={socket}
                    />
                </>
            )}
            {firstSong && !isGameOver && (
                <ChatMessagesContainer
                    messages={messages}
                    user={user}
                    socket={socket}
                    currentChatroom={currentChatroom}
                    connectedUsers={connectedUsers}
                />
            )}
            {isGameOver && (
                <Scoreboard
                    chatroom={currentChatroom}
                    resetGame={resetGame}
                    closeGame={closeGame}
                    isHost={isHost}
                />
            )}
            {fetchError && showToast({ message: fetchError })}
        </>
    )
}

export default Chatroom

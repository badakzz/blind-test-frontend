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
} from './'
import { useSocket } from '../utils/hooks'
import { useAudioManager } from '../utils/hooks'
import { useGameManager } from '../utils/hooks'
import { useChatroomManager } from '../utils/hooks'
import { usePlaylistManager } from '../utils/hooks'
import { useNavigate } from 'react-router-dom'
import { AuthState } from '../store/authSlice'
import api from '../api'

const Chatroom: React.FC = () => {
    const [messages, setMessages] = useState([])
    const [showPlaylistPicker, setShowPlaylistPicker] = useState(false)
    const handleHidePlaylistPicker = () => setShowPlaylistPicker(false)
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const [isWaitingForHost, setIsWaitingForHost] = useState<boolean>(false)
    const [isHost, setIsHost] = useState<boolean>(false)
    const [trackPreviewList, setTrackPreviewList] = useState([])
    const [isInRoom, setIsInRoom] = useState<boolean>(false)
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
    const [isSearchSelection, setIsSearchSelection] = useState<boolean>(false)

    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const navigate = useNavigate()

    const { socket, connectedUsers } = useSocket()

    const { gameStarted, firstSong, isGameOver, startGame, resetGame } =
        useGameManager(
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
    } = useAudioManager(isGameOver, socket, currentChatroom)

    const { currentSongPlaying, setCurrentSongPlaying, fetchError } =
        usePlaylistManager(
            playlistId,
            currentChatroom,
            trackPreviewList,
            setTrackPreviewList,
            isSearchSelection
        )

    console.log('trackPreviewList', trackPreviewList)

    useEffect(() => {
        if (!user) {
            return navigate('/')
        }
    }, [user])

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
            socket.off('artistAndSongNamesFound')

            socket.on('artistAndSongNamesFound', () => {
                if (currentChatroom && currentChatroom.chatroomId) {
                    if (audio && audio instanceof Audio) {
                        audio.pause()
                        setIsAudioPlaying(false)
                        socket.emit('audioEnded', currentChatroom.chatroomId)
                    }
                }
            })
        }
    }, [socket, currentChatroom, firstSong])

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
            console.log({ currentSongPlaying, currentChatroom })
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
            {currentChatroom && !isWaitingForHost && (
                <PlaylistPicker
                    currentChatroom={currentChatroom}
                    show={showPlaylistPicker}
                    onHide={handleHidePlaylistPicker}
                    onPlaylistSelected={setPlaylistId}
                    isInRoom={isInRoom}
                    connectedUsers={connectedUsers}
                    setIsSearchSelection={setIsSearchSelection}
                    isSearchSelection={isSearchSelection}
                />
            )}
            {!firstSong && isWaitingForHost && !isHost && (
                <p>Waiting for the host to start the game...</p>
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
                    isGameOver={isGameOver}
                    resetGame={resetGame}
                    isHost={isHost}
                />
            )}
            {fetchError && <div className="text-red">{fetchError}</div>}
        </>
    )
}

export default Chatroom

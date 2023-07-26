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
    CountdownBar,
    TimeUpMessage,
} from './'
import { useSocket } from '../utils/hooks'
import { useAudioManager } from '../utils/hooks'
import { useGameManager } from '../utils/hooks'
import { useChatroomManager } from '../utils/hooks'
import { usePlaylistManager } from '../utils/hooks'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Song } from '../utils/types'
import api from '../api'

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
    const [isTimeUp, setIsTimeUp] = useState(false)
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const navigate = useNavigate()

    const { socket, connectedUsers } = useSocket()

    const { gameStarted, firstSong, isGameOver, startGame, resetGame } =
        useGameManager(
            socket,
            setTrackPreviewList,
            isHost,
            setShowModalPlaylistSelection
        )

    console.log(firstSong, gameStarted, isGameOver)

    const { createRoom, joinRoom, currentChatroom } = useChatroomManager(socket)

    const {
        audio,
        playTrack,
        isAudioPlaying,
        setIsAudioPlaying,
        currentSongCredentials,
    } = useAudioManager(isGameOver, setIsTimeUp, socket, currentChatroom)

    const { currentSongPlaying, setCurrentSongPlaying } = usePlaylistManager(
        playlistId,
        currentChatroom,
        csrfToken,
        trackPreviewList,
        setTrackPreviewList
    )

    useEffect(() => {
        if (!user) {
            return navigate('/')
        }
    }, [user])

    const playNextTrack = () => {
        console.log('playNextTrack called with index:', currentSongIndex)
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
                console.log('No more tracks to play')
                return prevIndex
            }
        })
    }

    useEffect(() => {
        if (firstSong) {
            console.log('firstSong has been set')
            const index = trackPreviewList.findIndex(
                (track) => track.song_id === firstSong.song_id
            )
            console.log('currentTrackIndex', index)
            setCurrentSongIndex(index)
            const songId = playTrack(firstSong, playNextTrack)
            if (songId) {
                setCurrentSongPlaying(songId)
            }
        }
    }, [firstSong])

    // useEffect(() => {
    //     if (firstSong) {
    //         const songId = playTrack(firstSong)
    //         console.log("returned id from playtrack", songId)
    //         if (songId) {
    //             setCurrentSongPlaying(songId)
    //         }
    //     }
    // }, [firstSong])
    useEffect(() => {
        if (socket) {
            // Clean up old event listeners
            console.log('listen events')
            socket.off('chatMessage')

            // Set up new event listeners
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
                    console.log('yo', currentChatroom?.chatroomId, audio)
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
                console.log('Received syncTimeOut event')
                playNextTrack()
                setIsTimeUp(false)
            })
        }
    }, [socket, playNextTrack])

    useEffect(() => {
        if (currentSongPlaying && currentChatroom && socket) {
            // Emit event to server with current song
            socket.emit('currentSongPlaying', {
                chatroomId: currentChatroom.chatroomId,
                currentSongPlaying: currentSongPlaying,
            })
        }
    }, [currentSongPlaying, currentChatroom, socket])

    useEffect(() => {
        if (trackPreviewList.length > 0 && currentChatroom) {
            console.log(trackPreviewList, currentChatroom.chatroomId, isHost)
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
            {!firstSong && isWaitingForHost && !isHost && (
                <p>Waiting for the host to start the game...</p>
            )}
            {firstSong && !isTimeUp && (
                <CountdownBar
                    duration={isAudioPlaying ? 30 : 5} // adjust duration based on whether audio is playing
                    color={isAudioPlaying ? 'green' : 'orange'}
                    socket={socket}
                />
            )}
            {firstSong && isTimeUp && (
                <>
                    <TimeUpMessage song={currentSongCredentials} />
                    <CountdownBar
                        duration={5} // adjust duration based on whether audio is playing
                        color={'orange'}
                        socket={socket}
                    />
                </>
            )}
            {firstSong && (
                <ChatMessagesContainer
                    messages={messages}
                    user={user}
                    socket={socket}
                    currentChatroom={currentChatroom}
                />
            )}
            {isInRoom && <UsersInRoom connectedUsers={connectedUsers} />}
            {isGameOver && <Scoreboard chatroom={currentChatroom} />}
            {isGameOver && <button onClick={resetGame}>Play Again</button>}
        </>
    )
}

export default Chatroom

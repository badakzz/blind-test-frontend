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
    const [songCredentials, setSongCredentials] = useState<Song | null>(null)
    const [isTimeUp, setIsTimeUp] = useState(false)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const navigate = useNavigate()

    const { socket, connectedUsers } = useSocket()

    const { gameStarted, currentSong, isGameOver, startGame } = useGameManager(
        socket,
        isHost
    )

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

    // const playNextTrack = (currentTrackIndex) => {
    //     if (currentTrackIndex < trackPreviewList.length - 1) {
    //         const nextTrack = trackPreviewList[currentTrackIndex + 1]
    //         const songId = playTrack(nextTrack, () => {
    //             playNextTrack(currentTrackIndex + 1)
    //             setFound(false)
    //         })
    //         if (songId) {
    //             setCurrentSongPlaying(songId)
    //         }
    //     }
    // }

    const playNextTrack = (currentTrackIndex) => {
        if (currentTrackIndex < trackPreviewList.length - 1) {
            const nextTrack = trackPreviewList[currentTrackIndex + 1]
            setIsAudioPlaying(true) // set to true before playing the track
            const songId = playTrack(nextTrack, () =>
                playNextTrack(currentTrackIndex + 1)
            )
            if (songId) {
                setCurrentSongPlaying(songId)
            }
        }
    }

    console.log('currentSong', currentSong)
    useEffect(() => {
        if (currentSong) {
            const currentTrackIndex = trackPreviewList.findIndex(
                (track) => track.song_id === currentSong.song_id
            )
            console.log('currentTrackIndex', currentTrackIndex)
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
            console.log('listen events')
            socket.off('chatMessage')
            socket.off('gameStarted')

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
        if (socket) {
            socket.off('artistAndSongNamesFound')
            socket.off('syncTimeOut')

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
    }, [socket, currentChatroom, currentSong])

    useEffect(() => {
        if (socket) {
            socket.off('syncTimeOut')

            socket.on('syncTimeOut', async () => {
                console.log('Received syncTimeOut event')
                if (currentSongPlaying) {
                    const currentTrackIndex = trackPreviewList.findIndex(
                        (track) => track.song_id === currentSongPlaying
                    )
                    playNextTrack(currentTrackIndex + 1)
                    setIsTimeUp(false)
                }
            })
        }
    }, [socket, currentSongPlaying])

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
            {currentSong && !isTimeUp && (
                <CountdownBar
                    duration={isAudioPlaying ? 30 : 5} // adjust duration based on whether audio is playing
                    color={isAudioPlaying ? 'green' : 'orange'}
                    socket={socket}
                />
            )}
            {currentSong && isTimeUp && (
                <>
                    {console.log('conditions met')}
                    <TimeUpMessage song={currentSongCredentials} />
                    <CountdownBar
                        duration={5} // adjust duration based on whether audio is playing
                        color={'orange'}
                        socket={socket}
                    />
                </>
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

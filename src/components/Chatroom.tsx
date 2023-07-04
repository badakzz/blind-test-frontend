import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { User } from '../utils/types/User'
import {
    ChatMessagesContainer,
    CreateOrJoinChatroom,
    PlaylistSelectionModal,
    Scoreboard,
} from './'
import { startGame, startPlayback } from '../utils/helpers'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

interface ChatroomProps {
    user: User | null
}

const Chatroom: React.FC<ChatroomProps> = ({ user }) => {
    const [socket, setSocket] = useState(null)
    const [messages, setMessages] = useState([])
    const [connectedUsers, setConnectedUsers] = useState<string[]>([])
    const [validatedUsername, setValidatedUsername] = useState(false)
    const [playlistId, setPlaylistId] = useState(null)
    const [previewUrls, setPreviewUrls] = useState([])
    const [trackPreviews, setTrackPreviews] = useState([])
    const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false)
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
    const [currentChatroom, setCurrentChatroom] = useState<{
        chatroomId: string
    }>(null)
    const [currentSongName, setCurrentSongName] = useState<string>(null)
    const [currentArtistName, setCurrentArtistName] = useState<string>(null)
    const [isGameStopped, setIsGameStopped] = useState<boolean>(false)
    const [isCreator, setIsCreator] = useState<boolean>(false)
    const [isGameStarting, setIsGameStarting] = useState<boolean>(false)
    const [currentSongPlaying, setCurrentSongPlaying] = useState<string>('')
    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const audioRef = useRef(typeof window === 'undefined' ? null : new Audio())

    useEffect(() => {
        if (playlistId) {
            const fetchTrackPreviews = async () => {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/tracks/${playlistId}`,
                    {
                        params: {
                            numPreviews: 10,
                            chatroomId: currentChatroom.chatroomId,
                        },
                    }
                )
                const previews = response.data
                // to change to => preview.preview_url after tests
                const urls = previews.map((preview) => preview)
                console.log('urls', urls)
                setPreviewUrls(urls)
            }
            fetchTrackPreviews()
        }
    }, [playlistId])

    // useEffect(() => {
    //     const newSocket = io('http://localhost:3001')
    //     setSocket(newSocket)

    //     newSocket.on('users', (users) => {
    //         setUsers(users)
    //     })

    //     const createChatroom = async () => {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms`
    //         )
    //         const chatroomId = response.data.chatroomId
    //         const currentUrl = window.location.href
    //         const roomUrl = `${currentUrl}?chatroomId=${chatroomId}`
    //         alert(
    //             `Chatroom created! Share this link with others to join: ${roomUrl}`
    //         )
    //         setCurrentChatroom(chatroomId) // Set the current chatroom id
    //     }
    //     createChatroom()

    //     return () => {
    //         newSocket.off('users')
    //         newSocket.disconnect()
    //     }
    // }, [])

    useEffect(() => {
        const newSocket = io(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_WEBSOCKET_SERVER_PORT}`
        )
        setSocket(newSocket)

        newSocket.on('connectedUsers', (users) => {
            // map over the users array and pull out the username property from each user
            const usernames = users.map((user) => user.username)
            setConnectedUsers(usernames)
        })

        return () => {
            newSocket.off('connectedUsers')
            newSocket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket && isGameStarting) {
            if (!isCreator) {
                socket.on('gameStarted', async () => {
                    console.log('previewUrls', previewUrls)
                    const { audio: newAudio, currentSongId } = await startGame(
                        setGameStarted,
                        previewUrls,
                        startPlayback,
                        setCurrentSongIndex,
                        isGameStopped,
                        audioRef.current
                    )
                    console.log('client song id', currentSongId)
                    if (newAudio) {
                        setCurrentSongIndex(0)
                        setCurrentSongPlaying(currentSongId) // Update the song id here
                    }
                    setIsGameStarting(false)
                })

                return () => {
                    socket.off('gameStarted')
                }
            } else {
                socket.on('gameStarted', async () => {
                    const { audio: newAudio, currentSongId } = await startGame(
                        setGameStarted,
                        previewUrls,
                        startPlayback,
                        setCurrentSongIndex,
                        isGameStopped,
                        audioRef.current
                    )
                    if (newAudio) {
                        setCurrentSongIndex(0)
                        setCurrentSongPlaying(currentSongId) // Update the song id here
                    }
                    setIsGameStarting(false)
                })

                return () => {
                    socket.off('gameStarted')
                }
            }
        }
    }, [socket, isGameStarting])

    useEffect(() => {
        if (trackPreviews && trackPreviews[currentSongIndex]) {
            setCurrentSongName(trackPreviews[currentSongIndex].name)
            setCurrentArtistName(trackPreviews[currentSongIndex].artist)
        }
    }, [trackPreviews, currentSongIndex])

    useEffect(() => {
        if (socket) {
            // Clean up old event listeners
            socket.off('chatMessage')
            socket.off('scoreUpdated')

            // Set up new event listeners
            socket.on('chatMessage', (msg) => {
                setMessages((currentMsg) => [...currentMsg, msg])

                // Only analyze and attribute score for messages sent by the current user
                // if (msg.author === user.user_name) {
                //     const normalizedMGuessWords = normalizeAnswer(
                //         msg.message
                //     ).split(" ")
                //     const normalizedParsedSongNameWords =
                //         normalizeAnswer(currentSongName).split(" ")
                //     const normalizedParsedArtistNameWords =
                //         normalizeAnswer(currentArtistName).split(" ")

                //     const answer = analyzeAnswerAndAttributeScore(
                //         user.user_id,
                //         normalizedParsedSongNameWords,
                //         normalizedMGuessWords,
                //         normalizedParsedArtistNameWords
                //     )
                // if (answer.points > 0) {
                //     socket.emit(
                //         "updateScore",
                //         currentChatroom,
                //         user.user_id,
                //         answer.points,
                //         answer.correctGuessType,
                //         currentSongName,
                //         currentArtistName
                //     )
                // }
                // }
            })

            //     socket.on('scoreUpdated', ({ user, correctGuessType }) => {
            //         const guessMessage = {
            //             author: 'System',
            //             message: `${user.user_name} has correctly guessed the ${correctGuessType}!`,
            //         }
            //         socket.emit('chatMessage', guessMessage)
            //     })
            //     return () => {
            //         socket.off('chatMessage')
            //         socket.off('scoreUpdated')
            //     }
        }
    }, [socket, currentSongName, currentArtistName, user])

    useEffect(() => {
        if (socket) {
            socket.on('gameOver', (finalScores, winnerId) => {
                setIsGameStopped(true)

                if (audioRef.current && audioRef.current instanceof Audio) {
                    audioRef.current.pause()
                } else {
                    console.error(
                        'Audio object is not defined or not an instance of Audio.'
                    )
                }
                console.log('Final scores:', finalScores)
                console.log('Winner:', winnerId)
            })
            return () => {
                socket.off('gameOver')
            }
        }
    }, [socket])

    useEffect(() => {
        console.log('currentSongPlaying', currentSongPlaying)
        if (currentSongPlaying && currentChatroom) {
            const updateCurrentSongPlaying = async () => {
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms/${currentChatroom.chatroomId}/current_song_playing_id`,
                        { chatroom_current_song_id: currentSongPlaying },
                        {
                            headers: {
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            withCredentials: true,
                        }
                    )
                    if (response.status !== 200) {
                        console.error(
                            'Failed to update the current song playing'
                        )
                    }
                } catch (error) {
                    console.error(
                        'An error occurred while updating the current song playing',
                        error
                    )
                }
            }
            updateCurrentSongPlaying()
        }
    }, [currentSongPlaying, currentChatroom, csrfToken])

    const handleCreateRoom = async (username) => {
        let finalUsername = username

        if (user) {
            finalUsername = user.username
        } else if (!username) {
            finalUsername = `guest${connectedUsers.length + 1}`
        }

        if (finalUsername && socket) {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            )

            const chatroomId = response.data.chatroom_id
            const currentUrl = window.location.href
            const roomUrl = `${currentUrl}?chatroomId=${chatroomId}`
            alert(
                `Chatroom created! Share this link with others to join: ${roomUrl}`
            )
            setCurrentChatroom({ chatroomId })
            // probably create a user in db with ip address or smth
            socket.emit('createRoom', finalUsername, chatroomId)
            setValidatedUsername(true)
            setIsCreator(true)
        }
    }

    const handleJoinRoom = (username: string, chatroomId: string) => {
        if (chatroomId) {
            let finalUsername = username

            if (user) {
                finalUsername = user.username
            } else if (!username) {
                finalUsername = `guest${connectedUsers.length + 1}`
            }
            if (finalUsername) {
                setValidatedUsername(true)
                setIsCreator(false) // Set isCreator to false
                setIsGameStarting(true) // Set isGameStarting to true
                setCurrentChatroom({ chatroomId })
                socket.emit('joinRoom', finalUsername, chatroomId)
            }
        }
    }

    const handleOpenPlaylistModal = () => {
        setShowPlaylistModal(true)
    }

    const handleClosePlaylistModal = () => {
        setShowPlaylistModal(false)
    }

    const handlePlaylistSelected = (playlistId) => {
        setPlaylistId(playlistId)
    }

    const handleStartGame = () => {
        socket.emit('startGame', {
            chatroomId: currentChatroom.chatroomId,
            trackPreviews: previewUrls,
        })
        setIsGameStarting(true)
    }

    return (
        <div>
            <h1>Chatroom</h1>
            {!validatedUsername && (
                <CreateOrJoinChatroom
                    user={user}
                    onCreate={handleCreateRoom}
                    onJoin={handleJoinRoom}
                />
            )}
            {validatedUsername && !playlistId && (
                <>
                    {isCreator ? (
                        <>
                            <button onClick={handleOpenPlaylistModal}>
                                Select Playlist
                            </button>

                            <PlaylistSelectionModal
                                show={showPlaylistModal}
                                onPlaylistSelected={handlePlaylistSelected}
                                onModalClose={handleClosePlaylistModal}
                            />
                        </>
                    ) : (
                        'Waiting for the host to launch the game'
                    )}
                </>
            )}
            {playlistId && !gameStarted && (
                <button
                    onClick={() => {
                        handleStartGame()
                        setGameStarted(true)
                    }}
                >
                    Start Game
                </button>
            )}
            {gameStarted && (
                <ChatMessagesContainer
                    messages={messages}
                    user={user}
                    socket={socket}
                    connectedUsers={connectedUsers}
                    currentChatroom={currentChatroom}
                    currentSongPlaying={currentSongPlaying}
                />
            )}
            {isGameStopped && <Scoreboard chatroom={currentChatroom} />}
        </div>
    )
}

export default Chatroom

/*
The client-side code you shared seems to be a single React component that contains a lot of logic and state management. As a rule of thumb, it's better to split such components into smaller, more manageable parts that handle specific functionalities.

For example, you can create custom React hooks to handle your state and effects, move utility functions into a separate file in the utils directory, and extract parts of the render method into separate components to improve readability and maintainability of your code. You can also consider using a state management library such as Redux or Mobx, or the built-in React context API to handle the state shared between components.

Remember, it's important to adhere to the Single Responsibility Principle, i.e., a function or component should ideally only do one thing. If it's doing more, it might be a good idea to break it up.
*/

import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { User } from "../utils/types/User"
import {
    ChatMessagesContainer,
    CreateOrJoinChatroom,
    PlaylistSelectionModal,
    Scoreboard,
} from "./"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../store"

interface ChatroomProps {
    user: User | null
}

const Chatroom: React.FC<ChatroomProps> = ({ user }) => {
    const [socket, setSocket] = useState(null)
    const [messages, setMessages] = useState([])
    const [connectedUsers, setConnectedUsers] = useState<string[]>([])
    const [validatedUsername, setValidatedUsername] = useState(false)
    const [playlistId, setPlaylistId] = useState(null)
    const [trackPreviewList, setTrackPreviewList] = useState([])
    const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false)
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
    const [currentChatroom, setCurrentChatroom] = useState<{
        chatroomId: string
    }>(null)
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
    const [isCreator, setIsCreator] = useState<boolean>(false)
    const [isGameStarting, setIsGameStarting] = useState<boolean>(false)
    const [currentSongPlaying, setCurrentSongPlaying] = useState<string>("")
    const [fetchTrackPreviewsError, setFetchTrackPreviewsError] = useState(null)

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)
    const [audio, setAudio] = useState(null)

    const playTrack = (track) => {
        console.log("name", track.song_name)
        console.log("artist", track.artist_name)
        if (track && track.preview_url) {
            const newAudio = new Audio(track.preview_url)
            newAudio.play()

            // When the track ends, play the next one (if there are any left)
            newAudio.onended = () => {
                const nextIndex = currentSongIndex + 1
                // Stop after 10 tracks
                if (nextIndex < 10 && trackPreviewList[nextIndex]) {
                    // Wait for 5 seconds before playing the next track
                    setTimeout(() => {
                        playTrack(trackPreviewList[nextIndex])
                        setCurrentSongIndex(nextIndex)
                        setCurrentSongPlaying(
                            trackPreviewList[nextIndex].song_id
                        )
                        socket.emit("trackChanged", {
                            currentSongId: trackPreviewList[nextIndex].song_id,
                        })
                    }, 5000)
                } else {
                    // Game is over, handle this as needed
                    setIsGameOver(true)
                }
            }
            setAudio(newAudio)
            return track.song_id
        } else {
            console.error("Invalid track or track.preview_url is not defined.")
            return null
        }
    }

    useEffect(() => {
        const newSocket = io(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_WEBSOCKET_SERVER_PORT}`
        )
        setSocket(newSocket)

        newSocket.on("connectedUsers", (users) => {
            // map over the users array and pull out the username property from each user
            const usernames = users.map((user) => user.username)
            setConnectedUsers(usernames)
        })

        return () => {
            newSocket.off("connectedUsers")
            newSocket.disconnect()
        }
    }, [])

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
        if (playlistId) {
            const fetchTrackPreviews = async () => {
                try {
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
                    const previewList = previews.map((preview) => preview)
                    console.log("previewList", previewList)
                    setTrackPreviewList(previewList)
                } catch (error) {
                    console.error(error)
                    setFetchTrackPreviewsError(error) // Save error to state
                }
            }
            fetchTrackPreviews()
        }
    }, [playlistId])

    useEffect(() => {
        if (socket) {
            socket.on("gameStarted", (trackPreviews) => {
                if (!isCreator && trackPreviews.length > 0) {
                    setTrackPreviewList(trackPreviews)
                    const currentSongId = playTrack(trackPreviews[0])
                    if (currentSongId) {
                        setCurrentSongIndex(0)
                        setCurrentSongPlaying(currentSongId)
                    }
                }
            })

            return () => socket.off("gameStarted")
        }
    }, [socket, isCreator])

    console.log("trackPreviews", trackPreviewList)

    useEffect(() => {
        if (isGameStarting && trackPreviewList && socket) {
            // Only start the game if the trackPreviewList is not empty
            if (trackPreviewList.length > 0) {
                // Play the first track for the creator
                if (isCreator) {
                    const { audio: newAudio, currentSongId } = playTrack(
                        trackPreviewList[0]
                    )
                    if (newAudio) {
                        setCurrentSongIndex(0)
                        setCurrentSongPlaying(currentSongId)
                        setAudio(newAudio)
                    }
                    // Emit an event to start the game for the other users
                    socket.emit("startGame", {
                        currentSongId,
                        trackPreviewList,
                    })
                }
            }
        }
    }, [isGameStarting, trackPreviewList])

    useEffect(() => {
        if (isGameStarting && trackPreviewList.length > 0 && socket) {
            if (isCreator) {
                const currentSongId = playTrack(trackPreviewList[0])
                if (currentSongId) {
                    setCurrentSongIndex(0)
                    setCurrentSongPlaying(currentSongId)
                    socket.emit("startGame", {
                        chatroomId: currentChatroom.chatroomId,
                        currentSongId,
                        trackPreviewList,
                    })
                }
            }
        }
    }, [isGameStarting, trackPreviewList])

    useEffect(() => {
        if (socket) {
            socket.on("gameStarted", ({ currentSongId, trackPreviewList }) => {
                setGameStarted(true)
                console.log("JoinertrackPreviewList", trackPreviewList)
                if (!isCreator) {
                    setTrackPreviewList(trackPreviewList)
                    playTrack(
                        trackPreviewList.find(
                            (track) => track.song_id === currentSongId
                        )
                    )
                    setCurrentSongIndex(0)
                    setCurrentSongPlaying(currentSongId)
                }
            })

            return () => socket.off("startGame")
        }
    }, [socket])

    useEffect(() => {
        if (isGameOver && audio) {
            audio.pause()
        }
    }, [isGameOver, audio])

    useEffect(() => {
        console.log("currentSongPlaying", currentSongPlaying)
        if (currentSongPlaying && currentChatroom) {
            const updateCurrentSongPlaying = async () => {
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms/${currentChatroom.chatroomId}/current_song_playing_id`,
                        { chatroom_current_song_id: currentSongPlaying },
                        {
                            headers: {
                                "X-CSRF-TOKEN": csrfToken,
                            },
                            withCredentials: true,
                        }
                    )
                    if (response.status !== 200) {
                        console.error(
                            "Failed to update the current song playing"
                        )
                    }
                } catch (error) {
                    console.error(
                        "An error occurred while updating the current song playing",
                        error
                    )
                }
            }
            updateCurrentSongPlaying()
        }
    }, [currentSongPlaying, currentChatroom, csrfToken])

    useEffect(() => {
        if (socket) {
            socket.on("gameOver", (winnerId) => {
                setIsGameOver(true)

                if (audio && audio instanceof Audio) {
                    audio.pause()
                } else {
                    console.error(
                        "Audio object is not defined or not an instance of Audio."
                    )
                }
                console.log("Winner:", winnerId)
            })
            return () => {
                socket.off("gameOver")
            }
        }
    }, [socket, audio])

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
                        "X-CSRF-TOKEN": csrfToken,
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
            socket.emit("createRoom", finalUsername, chatroomId)
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
                socket.emit("joinRoom", finalUsername, chatroomId)
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
                        "Waiting for the host to launch the game"
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
            {isGameOver && <Scoreboard chatroom={currentChatroom} />}
            {fetchTrackPreviewsError && (
                <div>
                    Error loading track previews:{" "}
                    {fetchTrackPreviewsError.message}
                </div>
            )}
        </div>
    )
}

export default Chatroom

/*
The client-side code you shared seems to be a single React component that contains a lot of logic and state management. As a rule of thumb, it's better to split such components into smaller, more manageable parts that handle specific functionalities.

For example, you can create custom React hooks to handle your state and effects, move utility functions into a separate file in the utils directory, and extract parts of the render method into separate components to improve readability and maintainability of your code. You can also consider using a state management library such as Redux or Mobx, or the built-in React context API to handle the state shared between components.

Remember, it's important to adhere to the Single Responsibility Principle, i.e., a function or component should ideally only do one thing. If it's doing more, it might be a good idea to break it up.
*/
